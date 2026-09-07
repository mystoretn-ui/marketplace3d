const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "CHANGE_ME_IN_PRODUCTION";
const COMMISSION = 0.19;

const dataDir = path.join(__dirname, "data");
const uploadDir = path.join(__dirname, "public", "uploads");
const modelUploadDir = path.join(uploadDir, "models");
const profileUploadDir = path.join(uploadDir, "profiles");

for (const dir of [dataDir, uploadDir, modelUploadDir, profileUploadDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const dbFile = path.join(dataDir, "db.json");
const defaultDB = {
  users: [], models: [], purchases: [], comments: [], likes: [], follows: [], favorites: []
};

if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify(defaultDB, null, 2));

function readDB() {
  try {
    const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    return { ...defaultDB, ...db };
  } catch {
    return structuredClone(defaultDB);
  }
}

function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function cleanUsername(value) {
  return String(value || "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
}

function auth(req, res, next) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Authentication required." });
  }
}

function optionalAuth(req, _res, next) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  try { req.user = jwt.verify(token, SECRET); } catch { req.user = null; }
  next();
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, file.fieldname === "avatar" ? profileUploadDir : modelUploadDir);
  },
  filename: (_req, file, cb) => {
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${makeId()}-${safe}`);
  }
});

const allowedModel = [".stl", ".obj", ".3mf", ".zip", ".step", ".stp"];
const allowedImage = [".png", ".jpg", ".jpeg", ".webp"];

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === "avatar" || file.fieldname === "image") return cb(null, allowedImage.includes(ext));
    cb(null, allowedModel.includes(ext));
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || String(password).length < 6) {
    return res.status(400).json({ error: "Name, email and password (6+ chars) are required." });
  }

  const db = readDB();
  const normalizedEmail = String(email).toLowerCase().trim();
  if (db.users.some(u => u.email === normalizedEmail)) {
    return res.status(409).json({ error: "Email already registered." });
  }

  let username = cleanUsername(name) || `designer${Date.now()}`;
  if (db.users.some(u => u.profile?.username === username)) username += Math.floor(Math.random() * 9999);

  const user = {
    id: makeId(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(String(password), 12),
    role: "designer",
    profile: {
      username,
      bio: "3D designer and creator.",
      avatarUrl: "",
      social: { instagram: "", facebook: "", tiktok: "", youtube: "", discord: "" }
    },
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  writeDB(db);

  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: publicUser(user) });
});

app.post("/api/login", async (req, res) => {
  const db = readDB();
  const email = String(req.body.email || "").toLowerCase().trim();
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(String(req.body.password || ""), user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: publicUser(user) });
});

app.get("/api/me", auth, (req, res) => {
  const user = readDB().users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json(publicUser(user));
});

app.post("/api/logout", auth, (_req, res) => res.json({ ok: true }));

app.get("/api/models", optionalAuth, (req, res) => {
  const db = readDB();
  const q = String(req.query.q || "").toLowerCase().trim();
  const category = String(req.query.category || "").toLowerCase().trim();
  const sort = String(req.query.sort || "newest");

  let models = db.models.filter(m => {
    const text = `${m.title} ${m.description} ${m.category} ${m.designerName} ${(m.tags || []).join(" ")}`.toLowerCase();
    return (!q || text.includes(q)) && (!category || String(m.category).toLowerCase() === category);
  });

  if (sort === "popular") models.sort((a,b) => (b.downloads || 0) - (a.downloads || 0));
  else if (sort === "price_low") models.sort((a,b) => a.price - b.price);
  else models.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(models.map(m => enrichModel(m, db, req.user?.id)));
});

app.get("/api/models/:id", optionalAuth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found." });
  res.json(enrichModel(model, db, req.user?.id));
});

app.post("/api/models", auth, upload.fields([
  { name: "modelFile", maxCount: 1 },
  { name: "image", maxCount: 1 }
]), (req, res) => {
  if (!req.files?.modelFile?.[0]) return res.status(400).json({ error: "3D file is required." });

  const db = readDB();
  const price = Math.max(0, Number(req.body.price || 0));
  const paid = String(req.body.type || "").toLowerCase() === "paid" && price > 0;
  const tags = String(req.body.tags || "").split(",").map(x => x.trim()).filter(Boolean).slice(0, 15);

  const model = {
    id: makeId(),
    title: String(req.body.title || "Untitled model").trim(),
    description: String(req.body.description || "").trim(),
    category: String(req.body.category || "Other").trim(),
    tags,
    type: paid ? "paid" : "free",
    price: paid ? Number(price.toFixed(2)) : 0,
    designerId: req.user.id,
    designerName: req.user.name,
    fileUrl: `/uploads/models/${req.files.modelFile[0].filename}`,
    imageUrl: req.files.image?.[0] ? `/uploads/models/${req.files.image[0].filename}` : "",
    originalFileName: req.files.modelFile[0].originalname,
    downloads: 0,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  db.models.push(model);
  writeDB(db);
  res.json(enrichModel(model, db, req.user.id));
});

app.delete("/api/models/:id", auth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found." });
  if (model.designerId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ error: "Not allowed." });
  db.models = db.models.filter(m => m.id !== model.id);
  writeDB(db);
  res.json({ ok: true });
});

app.get("/api/designers/:username", optionalAuth, (req, res) => {
  const db = readDB();
  const username = cleanUsername(req.params.username);
  const user = db.users.find(u => u.profile?.username === username || cleanUsername(u.name) === username);
  if (!user) return res.status(404).json({ error: "Designer not found." });

  const models = db.models.filter(m => m.designerId === user.id);
  const followers = db.follows.filter(f => f.designerId === user.id).length;
  const downloads = models.reduce((sum, m) => sum + (m.downloads || 0), 0);

  res.json({
    ...publicUser(user),
    stats: { models: models.length, downloads, followers },
    models: models.map(m => enrichModel(m, db, req.user?.id)),
    isFollowing: !!req.user && db.follows.some(f => f.userId === req.user.id && f.designerId === user.id)
  });
});

app.put("/api/profile", auth, upload.single("avatar"), (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });

  const username = cleanUsername(req.body.username || user.profile.username);
  if (db.users.some(u => u.id !== user.id && u.profile?.username === username)) {
    return res.status(409).json({ error: "Username already taken." });
  }

  user.name = String(req.body.name || user.name).trim();
  user.profile.username = username;
  user.profile.bio = String(req.body.bio ?? user.profile.bio).trim();
  if (req.files?.avatar) user.profile.avatarUrl = `/uploads/profiles/${req.files.avatar.filename}`;

  const social = ["instagram","facebook","tiktok","youtube","discord"];
  for (const key of social) if (req.body[key] !== undefined) user.profile.social[key] = String(req.body[key]).trim();

  writeDB(db);
  res.json(publicUser(user));
});

app.post("/api/models/:id/like", auth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found." });

  const index = db.likes.findIndex(x => x.userId === req.user.id && x.modelId === model.id);
  if (index >= 0) db.likes.splice(index, 1);
  else db.likes.push({ userId: req.user.id, modelId: model.id });

  model.likes = db.likes.filter(x => x.modelId === model.id).length;
  writeDB(db);
  res.json({ liked: index < 0, likes: model.likes });
});

app.post("/api/models/:id/favorite", auth, (req, res) => {
  const db = readDB();
  const exists = db.favorites.findIndex(x => x.userId === req.user.id && x.modelId === req.params.id);
  if (exists >= 0) db.favorites.splice(exists, 1);
  else db.favorites.push({ userId: req.user.id, modelId: req.params.id });
  writeDB(db);
  res.json({ favorite: exists < 0 });
});

app.post("/api/designers/:id/follow", auth, (req, res) => {
  const db = readDB();
  if (req.params.id === req.user.id) return res.status(400).json({ error: "You cannot follow yourself." });
  const exists = db.follows.findIndex(x => x.userId === req.user.id && x.designerId === req.params.id);
  if (exists >= 0) db.follows.splice(exists, 1);
  else db.follows.push({ userId: req.user.id, designerId: req.params.id });
  writeDB(db);
  res.json({ following: exists < 0 });
});

app.post("/api/models/:id/comments", auth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found." });
  const text = String(req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "Comment is required." });

  const comment = { id: makeId(), modelId: model.id, userId: req.user.id, userName: req.user.name, text, createdAt: new Date().toISOString() };
  db.comments.push(comment);
  writeDB(db);
  res.json(comment);
});

app.get("/api/models/:id/comments", (req, res) => {
  const db = readDB();
  res.json(db.comments.filter(c => c.modelId === req.params.id).sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt)));
});

app.post("/api/purchase/:id", auth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found." });

  const existing = db.purchases.find(p => p.modelId === model.id && p.buyerId === req.user.id);
  if (existing) return res.json({ purchase: existing, downloadUrl: model.fileUrl });

  if (model.type === "paid") {
    const gross = Number(model.price.toFixed(2));
    const commission = Number((gross * COMMISSION).toFixed(2));
    const designerNet = Number((gross - commission).toFixed(2));
    const purchase = {
      id: makeId(), modelId: model.id, buyerId: req.user.id, designerId: model.designerId,
      gross, commission, designerNet, currency: "USD", createdAt: new Date().toISOString()
    };
    db.purchases.push(purchase);
    model.downloads = (model.downloads || 0) + 1;
    writeDB(db);
    return res.json({ purchase, downloadUrl: model.fileUrl, paymentRequired: true, demo: true });
  }

  const purchase = {
    id: makeId(), modelId: model.id, buyerId: req.user.id, designerId: model.designerId,
    gross: 0, commission: 0, designerNet: 0, currency: "USD", createdAt: new Date().toISOString()
  };
  db.purchases.push(purchase);
  model.downloads = (model.downloads || 0) + 1;
  writeDB(db);
  res.json({ purchase, downloadUrl: model.fileUrl, paymentRequired: false });
});

app.get("/api/dashboard", auth, (req, res) => {
  const db = readDB();
  const models = db.models.filter(m => m.designerId === req.user.id);
  const sales = db.purchases.filter(p => p.designerId === req.user.id);
  const earnings = sales.reduce((s,p) => s + Number(p.designerNet || 0), 0);
  res.json({
    models,
    salesCount: sales.length,
    earnings: Number(earnings.toFixed(2)),
    commissionRate: COMMISSION
  });
});

app.get("*splat", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, profile: user.profile || {} };
}

function enrichModel(model, db, currentUserId) {
  return {
    ...model,
    likes: db.likes.filter(x => x.modelId === model.id).length,
    liked: !!currentUserId && db.likes.some(x => x.modelId === model.id && x.userId === currentUserId),
    favorite: !!currentUserId && db.favorites.some(x => x.modelId === model.id && x.userId === currentUserId)
  };
}

app.listen(PORT, () => console.log(`Marketplace3D running on port ${PORT}`));

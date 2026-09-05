const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "CHANGE_ME_BEFORE_PRODUCTION";

const dataDir = path.join(__dirname, "data");
const uploadDir = path.join(__dirname, "public", "uploads");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const dbFile = path.join(dataDir, "db.json");

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(
    dbFile,
    JSON.stringify({
      users: [],
      models: [],
      purchases: []
    }, null, 2)
  );
}

const readDB = () =>
  JSON.parse(
    fs.readFileSync(dbFile, "utf8")
  );

const writeDB = db =>
  fs.writeFileSync(
    dbFile,
    JSON.stringify(db, null, 2)
  );

const makeId = () =>
  Date.now().toString(36) +
  Math.random().toString(36).slice(2, 8);


/* ================================
   UPLOAD
================================ */

const storage = multer.diskStorage({

  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },

  filename: (_, file, cb) => {

    const safe =
      file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

    cb(
      null,
      makeId() + "-" + safe
    );

  }

});


const upload = multer({

  storage,

  limits: {
    fileSize: 100 * 1024 * 1024
  },

  fileFilter: (_, file, cb) => {

    const ext =
      path.extname(
        file.originalname
      ).toLowerCase();

    const allowed = [
      ".stl",
      ".3mf",
      ".obj",
      ".zip",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp"
    ];

    cb(
      null,
      allowed.includes(ext)
    );

  }

});


/* ================================
   APP
================================ */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


/* ================================
   AUTH
================================ */

function auth(req, res, next) {

  const token =
    (req.headers.authorization || "")
      .replace("Bearer ", "");

  try {

    req.user =
      jwt.verify(
        token,
        SECRET
      );

    next();

  } catch {

    res.status(401).json({
      error:
        "Authentication required."
    });

  }

}


/* ================================
   MODELS
================================ */

app.get("/api/models", (req, res) => {

  const db = readDB();

  const q =
    (req.query.q || "")
      .toLowerCase();

  const category =
    (req.query.category || "")
      .toLowerCase();

  const models =
    db.models.filter(m =>

      (
        !q ||
        `${m.title} ${m.description} ${m.category}`
          .toLowerCase()
          .includes(q)
      )

      &&

      (
        !category ||
        m.category.toLowerCase() === category
      )

    );


  res.json(
    models.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
  );

});


app.get("/api/models/:id", (req, res) => {

  const db = readDB();

  const model =
    db.models.find(
      m => m.id === req.params.id
    );

  if (!model) {

    return res.status(404).json({
      error:
        "Model not found."
    });

  }

  res.json(model);

});


/* ================================
   REGISTER
================================ */

app.post("/api/register", async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;


  if (
    !name ||
    !email ||
    !password ||
    password.length < 6
  ) {

    return res.status(400).json({
      error:
        "Name, email and password (6+ chars) are required."
    });

  }


  const db = readDB();

  const cleanEmail =
    email
      .toLowerCase()
      .trim();

  const cleanName =
    name.trim();


  if (
    db.users.some(
      u => u.email === cleanEmail
    )
  ) {

    return res.status(409).json({
      error:
        "Email already registered."
    });

  }


  /* ============================
     USER
  ============================ */

  const userId = makeId();


  /* ============================
     USERNAME
  ============================ */

  const baseUsername =
    cleanName
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );


  const username =
    (
      baseUsername ||
      "designer"
    ) +
    "-" +
    userId.slice(-4);


  /* ============================
     USER + PROFILE
  ============================ */

  const user = {

    id: userId,

    name: cleanName,

    email: cleanEmail,

    passwordHash:
      await bcrypt.hash(
        password,
        10
      ),

    role: "designer",

    profile: {

      username: username,

      bio: "",

      avatarUrl: "",

      createdAt:
        new Date().toISOString()

    },

    createdAt:
      new Date().toISOString()

  };


  db.users.push(user);

  writeDB(db);


  /* ============================
     TOKEN
  ============================ */

  const token =
    jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role
      },
      SECRET,
      {
        expiresIn: "7d"
      }
    );


  res.json({

    token,

    user: {

      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,

      profile:
        user.profile

    }

  });

});


/* ================================
   LOGIN
================================ */

app.post("/api/login", async (req, res) => {

  const {
    email,
    password
  } = req.body;

  const db = readDB();

  const user =
    db.users.find(
      u =>
        u.email ===
        String(email || "")
          .toLowerCase()
          .trim()
    );


  if (
    !user ||
    !(await bcrypt.compare(
      password || "",
      user.passwordHash
    ))
  ) {

    return res.status(401).json({
      error:
        "Invalid email or password."
    });

  }


  /* ============================
     OLD USERS SUPPORT
  ============================ */

  if (!user.profile) {

    const userId =
      user.id;

    const baseUsername =
      String(user.name || "designer")
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );


    user.profile = {

      username:
        (
          baseUsername ||
          "designer"
        ) +
        "-" +
        userId.slice(-4),

      bio: "",

      avatarUrl: "",

      createdAt:
        new Date().toISOString()

    };


    writeDB(db);

  }


  const token =
    jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role
      },
      SECRET,
      {
        expiresIn: "7d"
      }
    );


  res.json({

    token,

    user: {

      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,

      profile:
        user.profile

    }

  });

});


/* ================================
   CURRENT USER
================================ */

app.get("/api/me", auth, (req, res) => {

  const db = readDB();

  const user =
    db.users.find(
      u => u.id === req.user.id
    );


  if (!user) {
    return res.json(null);
  }


  /* OLD USERS */

  if (!user.profile) {

    const baseUsername =
      String(user.name || "designer")
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );


    user.profile = {

      username:
        (
          baseUsername ||
          "designer"
        ) +
        "-" +
        user.id.slice(-4),

      bio: "",

      avatarUrl: "",

      createdAt:
        new Date().toISOString()

    };


    writeDB(db);

  }


  res.json({

    id: user.id,

    name: user.name,

    email: user.email,

    role: user.role,

    profile:
      user.profile

  });

});


/* ================================
   DESIGNER PORTFOLIO
================================ */

app.get(
  "/api/designers/:username",
  (req, res) => {

    const db = readDB();

    const username =
      String(
        req.params.username || ""
      )
        .toLowerCase()
        .trim();


    const designer =
      db.users.find(
        u =>
          u.profile &&
          String(
            u.profile.username || ""
          )
            .toLowerCase()
            === username
      );


    if (!designer) {

      return res.status(404).json({
        error:
          "Designer not found."
      });

    }


    /* ============================
       DESIGNER MODELS
    ============================ */

    const models =
      db.models.filter(
        m =>
          m.designerId ===
          designer.id
      );


    /* ============================
       DOWNLOADS
    ============================ */

    const downloads =
      db.purchases.filter(
        purchase =>
          models.some(
            model =>
              model.id ===
              purchase.modelId
          )
      ).length;


    /* ============================
       RESPONSE
    ============================ */

    res.json({

      id:
        designer.id,

      name:
        designer.name,

      profile:
        designer.profile,

      stats: {

        models:
          models.length,

        downloads:
          downloads

      },

      models:
        models.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )

    });

  }
);


/* ================================
   UPLOAD MODEL
================================ */

app.post(
  "/api/models",
  auth,
  upload.fields([
    {
      name: "modelFile",
      maxCount: 1
    },
    {
      name: "image",
      maxCount: 1
    }
  ]),
  (req, res) => {

    if (
      !req.files?.modelFile?.[0]
    ) {

      return res.status(400).json({
        error:
          "3D file is required."
      });

    }


    const db = readDB();

    const f =
      req.files.modelFile[0];

    const image =
      req.files.image?.[0];


    const model = {

      id: makeId(),

      title:
        req.body.title ||
        "Untitled model",

      description:
        req.body.description ||
        "",

      category:
        req.body.category ||
        "Other",

      price:
        Math.max(
          0,
          Number(
            req.body.price || 0
          )
        ),

      designerId:
        req.user.id,

      designerName:
        req.user.name,

      fileUrl:
        "/uploads/" +
        f.filename,

      imageUrl:
        image
          ? "/uploads/" +
            image.filename
          : "",

      originalFileName:
        f.originalname,

      createdAt:
        new Date().toISOString()

    };


    db.models.push(model);

    writeDB(db);


    res.json(model);

  }
);


/* ================================
   PURCHASE
================================ */

app.post(
  "/api/purchase/:id",
  auth,
  (req, res) => {

    const db = readDB();

    const model =
      db.models.find(
        m =>
          m.id ===
          req.params.id
      );


    if (!model) {

      return res.status(404).json({
        error:
          "Model not found."
      });

    }


    /*
      DEMO ONLY

      Real payment provider
      will be connected later.
    */

    const purchase = {

      id: makeId(),

      modelId:
        model.id,

      buyerId:
        req.user.id,

      price:
        model.price,

      createdAt:
        new Date().toISOString()

    };


    db.purchases.push(
      purchase
    );

    writeDB(db);


    res.json({

      purchase,

      downloadUrl:
        model.fileUrl

    });

  }
);


/* ================================
   FRONTEND
================================ */

app.get(
  "*",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );

  }
);


/* ================================
   START SERVER
================================ */

app.listen(
  PORT,
  () => {

    console.log(
      `Marketplace3D running on http://localhost:${PORT}`
    );

  }
);

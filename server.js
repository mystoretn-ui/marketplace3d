const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_MODELS = path.join(ROOT, "uploads", "models");
const UPLOAD_PROFILES = path.join(ROOT, "uploads", "profiles");

for (const d of [DATA_DIR, UPLOAD_MODELS, UPLOAD_PROFILES]) fs.mkdirSync(d, {recursive:true});
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({users:[],models:[],collections:[],sales:[]}, null, 2));

function db(){ return JSON.parse(fs.readFileSync(DB_FILE,"utf8")); }
function save(data){ fs.writeFileSync(DB_FILE, JSON.stringify(data,null,2)); }
function id(prefix){ return prefix+"_"+crypto.randomBytes(8).toString("hex"); }
function hashPassword(password){ const salt=crypto.randomBytes(16).toString("hex"); const hash=crypto.scryptSync(password,salt,64).toString("hex"); return `${salt}:${hash}`; }
function verifyPassword(password, stored){ if(stored==="demo1234") return password==="demo1234"; const [salt,key]=String(stored).split(":"); if(!salt||!key)return false; const hash=crypto.scryptSync(password,salt,64).toString("hex"); return crypto.timingSafeEqual(Buffer.from(hash,"hex"),Buffer.from(key,"hex")); }
function token(){return crypto.randomBytes(32).toString("hex")}
function cookies(req){const out={};String(req.headers.cookie||"").split(";").forEach(x=>{const [k,...v]=x.trim().split("=");if(k)out[k]=decodeURIComponent(v.join("="))});return out}
function currentUser(req){const t=cookies(req).session;if(!t)return null;const d=db();return d.users.find(u=>u.sessionToken===t)||null}
function safeUser(u){if(!u)return null;const {passwordHash,sessionToken,...x}=u;return x}
function ensureUser(req,res,next){const u=currentUser(req);if(!u)return res.status(401).json({error:"Vous devez être connecté."});req.user=u;next()}
function fileName(original){return `${Date.now()}-${crypto.randomBytes(5).toString("hex")}-${path.basename(original).replace(/[^a-zA-Z0-9._-]/g,"_")}`}

app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true}));
app.use("/uploads",express.static(path.join(ROOT,"uploads")));
app.use(express.static(PUBLIC));

const storage=multer.diskStorage({
  destination:(req,file,cb)=>cb(null,file.fieldname==="avatar"||file.fieldname==="profileImage"?UPLOAD_PROFILES:UPLOAD_MODELS),
  filename:(req,file,cb)=>cb(null,fileName(file.originalname))
});
const upload=multer({storage,limits:{fileSize:250*1024*1024}});

app.get("/api/me",(req,res)=>res.json({user:safeUser(currentUser(req))}));

app.post("/api/register",(req,res)=>{
  const {username,email,password,bio=""}=req.body;
  if(!username||!email||!password||password.length<6)return res.status(400).json({error:"Nom, email et mot de passe (6 caractères minimum) requis."});
  const d=db();
  if(d.users.some(u=>u.email.toLowerCase()===email.toLowerCase()))return res.status(409).json({error:"Cet email est déjà utilisé."});
  if(d.users.some(u=>u.username.toLowerCase()===username.toLowerCase()))return res.status(409).json({error:"Ce nom d'utilisateur est déjà utilisé."});
  const u={id:id("u"),username,email:email.toLowerCase(),passwordHash:hashPassword(password),bio,avatar:"/images/avatars/default.svg",location:"",website:"",social:{instagram:"",youtube:"",facebook:"",tiktok:""},followers:[],following:[],createdAt:new Date().toISOString()};
  d.users.push(u); d.collections.push({id:id("c"),name:"Mes premiers modèles",creatorId:u.id,modelIds:[]});
  const t=token();u.sessionToken=t;save(d);
  res.setHeader("Set-Cookie", `session=${encodeURIComponent(t)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*30}`);
  res.json({user:safeUser(u),redirect:`/profile.html?username=${encodeURIComponent(u.username)}`});
});

app.post("/api/login",(req,res)=>{
  const {email,password}=req.body,d=db(); const u=d.users.find(x=>x.email.toLowerCase()===String(email||"").toLowerCase());
  if(!u||!verifyPassword(password,u.passwordHash))return res.status(401).json({error:"Email ou mot de passe incorrect."});
  const t=token();u.sessionToken=t;save(d);res.setHeader("Set-Cookie", `session=${encodeURIComponent(t)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*30}`);res.json({user:safeUser(u),redirect:`/profile.html?username=${encodeURIComponent(u.username)}`});
});

app.post("/api/logout",(req,res)=>{const u=currentUser(req);if(u){const d=db();const x=d.users.find(z=>z.id===u.id);if(x)delete x.sessionToken;save(d)}res.setHeader("Set-Cookie","session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");res.json({ok:true})});

app.get("/api/models",(req,res)=>{
  const d=db(),q=String(req.query.q||"").toLowerCase(),cat=String(req.query.category||"");
  let models=d.models.filter(m=>(!q||[m.title,m.description,m.category,...(m.tags||[])].join(" ").toLowerCase().includes(q))&&(!cat||cat==="Tendance"||m.category===cat));
  models.sort((a,b)=>b.likes-a.likes);
  res.json({models:models.map(m=>({...m,creator:safeUser(d.users.find(u=>u.id===m.creatorId))}))});
});

app.get("/api/models/:id",(req,res)=>{
  const d=db(),m=d.models.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:"Modèle introuvable."});
  const creator=d.users.find(u=>u.id===m.creatorId);res.json({model:{...m,creator:safeUser(creator)}});
});

app.post("/api/models",ensureUser,upload.fields([{name:"modelFile",maxCount:1},{name:"thumbnail",maxCount:1}]),(req,res)=>{
  const f=req.files?.modelFile?.[0];if(!f)return res.status(400).json({error:"Fichier 3D obligatoire."});
  const allowed=[".stl",".obj",".3mf",".zip",".step",".stp"];if(!allowed.includes(path.extname(f.originalname).toLowerCase())){fs.unlinkSync(f.path);return res.status(400).json({error:"Format non supporté. Utilisez STL, OBJ, 3MF, ZIP, STEP ou STP."})}
  const d=db(),price=Math.max(0,Number(req.body.price||0)),thumb=req.files?.thumbnail?.[0]?"/uploads/models/"+req.files.thumbnail[0].filename:"/images/models/ghost.svg";
  const m={id:id("m"),title:String(req.body.title||"Nouveau modèle").slice(0,120),slug:String(req.body.title||"model").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),description:String(req.body.description||""),category:req.body.category||"Home & Decor",tags:String(req.body.tags||"").split(",").map(x=>x.trim()).filter(Boolean),creatorId:req.user.id,price,thumbnail:thumb,file:"/uploads/models/"+f.filename,originalFile:f.originalname,downloads:0,likes:0,favorites:0,comments:[],createdAt:new Date().toISOString()};
  d.models.push(m);const c=d.collections.find(c=>c.creatorId===req.user.id);if(c)c.modelIds.push(m.id);save(d);res.json({model:{...m,creator:safeUser(req.user)}});
});

app.get("/api/profile/:username",(req,res)=>{
  const d=db(),u=d.users.find(x=>x.username.toLowerCase()===String(req.params.username).toLowerCase());if(!u)return res.status(404).json({error:"Utilisateur introuvable."});
  const models=d.models.filter(m=>m.creatorId===u.id),collections=d.collections.filter(c=>c.creatorId===u.id),totalDownloads=models.reduce((s,m)=>s+m.downloads,0),me=currentUser(req);
  res.json({user:safeUser(u),models,collections,totalDownloads,isOwner:me?.id===u.id,following:!!me&&u.followers.includes(me.id)});
});

app.post("/api/profile/avatar",ensureUser,upload.single("avatar"),(req,res)=>{
  if(!req.file)return res.status(400).json({error:"Image de profil obligatoire."});
  if(!String(req.file.mimetype||"").startsWith("image/")){try{fs.unlinkSync(req.file.path)}catch{}return res.status(400).json({error:"L'avatar doit être une image."});}
  const d=db(),u=d.users.find(x=>x.id===req.user.id);u.avatar="/uploads/profiles/"+req.file.filename;save(d);res.json({user:safeUser(u)});
});

function safeUrl(value){const v=String(value||"").trim();if(!v)return "";try{const u=new URL(v);return ["http:","https:"].includes(u.protocol)?v.slice(0,500):""}catch{return ""}}
app.put("/api/profile",ensureUser,(req,res)=>{
  const d=db(),u=d.users.find(x=>x.id===req.user.id);
  if(req.body.bio!==undefined)u.bio=String(req.body.bio).slice(0,500);
  if(req.body.location!==undefined)u.location=String(req.body.location).slice(0,120);
  if(req.body.website!==undefined)u.website=safeUrl(req.body.website);
  if(req.body.social&&typeof req.body.social==="object"){u.social={...u.social};for(const k of ["instagram","youtube","facebook","tiktok"])if(req.body.social[k]!==undefined)u.social[k]=safeUrl(req.body.social[k]);}
  save(d);res.json({user:safeUser(u)});
});

app.post("/api/users/:username/follow",ensureUser,(req,res)=>{
  const d=db(),target=d.users.find(u=>u.username.toLowerCase()===String(req.params.username).toLowerCase());if(!target)return res.status(404).json({error:"Utilisateur introuvable."});if(target.id===req.user.id)return res.status(400).json({error:"Impossible de vous suivre vous-même."});
  const me=d.users.find(u=>u.id===req.user.id),i=target.followers.indexOf(me.id);
  if(i>=0){target.followers.splice(i,1);me.following=me.following.filter(x=>x!==target.id)}else{target.followers.push(me.id);if(!me.following.includes(target.id))me.following.push(target.id)}
  save(d);res.json({following:i<0});
});

app.post("/api/models/:id/like",ensureUser,(req,res)=>{
  const d=db(),m=d.models.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:"Modèle introuvable."});
  m.likedBy=Array.isArray(m.likedBy)?m.likedBy:[];const i=m.likedBy.indexOf(req.user.id);
  if(i>=0){m.likedBy.splice(i,1);m.likes=Math.max(0,m.likes-1);save(d);return res.json({liked:false,likes:m.likes});}
  m.likedBy.push(req.user.id);m.likes++;save(d);res.json({liked:true,likes:m.likes});
});

app.post("/api/models/:id/download",async(req,res)=>{
  const d=db(),m=d.models.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:"Modèle introuvable."});
  if(m.price>0){
    const u=currentUser(req);if(!u)return res.status(401).json({error:"Connectez-vous pour acheter ce modèle."});
    const commission=Number((m.price*.19).toFixed(2)),net=Number((m.price-commission).toFixed(2));
    d.sales.push({id:id("sale"),modelId:m.id,creatorId:m.creatorId,buyerId:u.id,gross:m.price,commission,net,createdAt:new Date().toISOString(),status:"demo-paid"});
    m.downloads++;save(d);
    if(m.file)return res.json({downloadUrl:m.file,message:`Paiement DEMO enregistré. Commission 19%: $${commission.toFixed(2)}. Créateur: $${net.toFixed(2)}.`});
    return res.json({message:`Commande DEMO enregistrée. Commission 19%: $${commission.toFixed(2)}.`});
  }
  m.downloads++;save(d);if(m.file)return res.json({downloadUrl:m.file});res.json({message:"Ce modèle de démonstration n'a pas de fichier téléchargeable."});
});

app.post("/api/models/:id/favorite",ensureUser,(req,res)=>{
  const d=db(),m=d.models.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:"Modèle introuvable."});
  m.favoritedBy=Array.isArray(m.favoritedBy)?m.favoritedBy:[];const i=m.favoritedBy.indexOf(req.user.id);
  if(i>=0){m.favoritedBy.splice(i,1);m.favorites=Math.max(0,(m.favorites||0)-1);save(d);return res.json({favorited:false,favorites:m.favorites});}
  m.favoritedBy.push(req.user.id);m.favorites=(m.favorites||0)+1;save(d);res.json({favorited:true,favorites:m.favorites});
});

app.post("/api/models/:id/comments",ensureUser,(req,res)=>{
  const d=db(),m=d.models.find(x=>x.id===req.params.id),text=String(req.body.text||"").trim();
  if(!m)return res.status(404).json({error:"Modèle introuvable."});
  if(!text)return res.status(400).json({error:"Commentaire vide."});
  m.comments=m.comments||[];
  m.comments.push({id:id("comment"),userId:req.user.id,username:req.user.username,text:text.slice(0,500),createdAt:new Date().toISOString()});
  save(d); res.json({comments:m.comments});
});

app.get("/api/dashboard",ensureUser,(req,res)=>{
  const d=db(),models=d.models.filter(m=>m.creatorId===req.user.id),sales=d.sales.filter(s=>s.creatorId===req.user.id),gross=sales.reduce((a,s)=>a+s.gross,0),net=sales.reduce((a,s)=>a+s.net,0),totalDownloads=models.reduce((a,m)=>a+m.downloads,0);res.json({user:safeUser(req.user),models,totalDownloads,gross,net,sales});
});

app.use((req,res,next)=>{if(req.method==="GET"&&req.accepts("html"))return res.sendFile(path.join(PUBLIC,"index.html"));next()});
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:"Erreur serveur."})});
app.listen(PORT,()=>console.log(`Marketplace3D running on http://localhost:${PORT}`));

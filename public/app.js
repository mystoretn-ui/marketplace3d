let token = localStorage.getItem("token");
const $ = s => document.querySelector(s);

async function api(url, options={}) {
  options.headers = options.headers || {};
  if (token) options.headers.Authorization = "Bearer " + token;
  const r = await fetch(url, options);
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.error || "Erreur");
  return data;
}

async function loadModels() {
  const q = encodeURIComponent($("#search").value || "");
  const models = await api("/api/models?q=" + q);
  $("#grid").innerHTML = models.length ? models.map(m => `
    <article class="card" onclick="showModel('${m.id}')">
      <div class="thumb">${m.imageUrl ? `<img src="${m.imageUrl}">` : "3D MODEL"}</div>
      <div class="cardBody">
        <h3>${escapeHtml(m.title)}</h3>
        <div class="muted">${escapeHtml(m.category)} • par ${escapeHtml(m.designerName)}</div>
        <div class="price">${m.price ? m.price.toFixed(2)+" €" : "Gratuit"}</div>
      </div>
    </article>`).join("") : `<p class="muted">Aucun modèle pour le moment.</p>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function showModel(id) {
  const m = await api("/api/models/"+id);
  $("#modalContent").innerHTML = `
    <p class="eyebrow">${escapeHtml(m.category)}</p>
    <h2>${escapeHtml(m.title)}</h2>
    <p class="muted">Designer : ${escapeHtml(m.designerName)}</p>
    <p>${escapeHtml(m.description || "Aucune description.")}</p>
    <strong>${m.price ? m.price.toFixed(2)+" €" : "Gratuit"}</strong><br>
    <button class="btn" onclick="buy('${m.id}')">${m.price ? "Acheter" : "Télécharger"}</button>`;
  $("#modal").classList.remove("hidden");
}

async function buy(id){
  if(!token){ openLogin(); return; }
  try{
    const r = await api("/api/purchase/"+id,{method:"POST"});
    alert("Démo : achat enregistré. Le paiement réel doit être connecté avant la mise en production.");
    window.open(r.downloadUrl,"_blank");
  }catch(e){alert(e.message)}
}

function openLogin(){
  $("#modalContent").innerHTML=`<h2>Connexion</h2><form onsubmit="login(event)">
    <input name="email" type="email" placeholder="Email" required>
    <input name="password" type="password" placeholder="Mot de passe" required>
    <button class="btn">Se connecter</button></form>
    <p class="muted">Pas de compte ? <a href="#" onclick="openRegister()">Créer un compte</a></p>`;
  $("#modal").classList.remove("hidden");
}
function openRegister(){
  $("#modalContent").innerHTML=`<h2>Créer un compte</h2><form onsubmit="register(event)">
    <input name="name" placeholder="Nom / pseudo" required>
    <input name="email" type="email" placeholder="Email" required>
    <input name="password" type="password" placeholder="Mot de passe (6+ caractères)" required>
    <button class="btn">Créer mon compte</button></form>`;
  $("#modal").classList.remove("hidden");
}
async function login(e){
  e.preventDefault(); const f=new FormData(e.target);
  try{const r=await api("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f))}); token=r.token;localStorage.setItem("token",token);closeModal();alert("Connexion réussie.");}
  catch(x){alert(x.message)}
}
async function register(e){
  e.preventDefault(); const f=new FormData(e.target);
  try{const r=await api("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f))}); token=r.token;localStorage.setItem("token",token);closeModal();alert("Compte créé.");}
  catch(x){alert(x.message)}
}
function openUpload(){
  if(!token){openLogin();return}
  $("#modalContent").innerHTML=`<h2>Publier un modèle</h2>
  <form onsubmit="uploadModel(event)">
    <input name="title" placeholder="Nom du modèle" required>
    <textarea name="description" placeholder="Description"></textarea>
    <select name="category"><option>Decoration</option><option>Mechanical</option><option>Figurines</option><option>Tools</option><option>Vehicles</option><option>Other</option></select>
    <input name="price" type="number" min="0" step="0.01" placeholder="Prix en €" value="0">
    <label>Fichier 3D (STL / 3MF / OBJ / ZIP)</label><input name="modelFile" type="file" accept=".stl,.3mf,.obj,.zip" required>
    <label>Image</label><input name="image" type="file" accept="image/*">
    <button class="btn">Publier</button>
  </form>`;
  $("#modal").classList.remove("hidden");
}
async function uploadModel(e){
  e.preventDefault();
  try{
    const r=await api("/api/models",{method:"POST",body:new FormData(e.target)});
    closeModal(); loadModels(); alert("Modèle publié.");
  }catch(x){alert(x.message)}
}
function closeModal(){$("#modal").classList.add("hidden")}
$("#loginBtn").onclick=openLogin;
$("#search").addEventListener("input",loadModels);
loadModels();
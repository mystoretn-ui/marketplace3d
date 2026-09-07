const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let state = { q:"", category:"", sort:"popular", user:null };

function token(){ return localStorage.getItem("m3d_token") || ""; }
function headers(){ return token() ? { Authorization:`Bearer ${token()}` } : {}; }

async function api(url, options={}) {
  const opts = {...options, headers:{...headers(), ...(options.headers||{})}};
  if (opts.body && !(opts.body instanceof FormData)) {
    opts.headers["Content-Type"]="application/json";
    opts.body=JSON.stringify(opts.body);
  }
  const r=await fetch(url,opts);
  const data=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.error||"Request failed");
  return data;
}

async function loadMe(){
  if(!token()) return;
  try { state.user=await api("/api/me"); renderUser(); }
  catch { localStorage.removeItem("m3d_token"); state.user=null; }
}

function renderUser(){
  const menu=$("#userMenu");
  if(!state.user){ menu.classList.add("hidden"); $("#loginBtn").classList.remove("hidden"); $("#registerBtn").classList.remove("hidden"); return; }
  $("#loginBtn").classList.add("hidden"); $("#registerBtn").classList.add("hidden");
  menu.classList.remove("hidden");
  const p=state.user.profile||{};
  menu.innerHTML=`<a href="/?profile=${encodeURIComponent(p.username)}" class="avatar">${(state.user.name||"3D").slice(0,2).toUpperCase()}</a><button class="btn ghost" id="logoutBtn">Log out</button>`;
  $("#logoutBtn").onclick=async()=>{try{await api("/api/logout",{method:"POST"})}catch{} localStorage.removeItem("m3d_token"); location.reload();};
}

async function loadModels(){
  const grid=$("#modelGrid");
  grid.innerHTML="<div class='designer-placeholder'>Loading models...</div>";
  try{
    const params=new URLSearchParams({q:state.q,category:state.category,sort:state.sort});
    const models=await api("/api/models?"+params);
    if(!models.length){grid.innerHTML="<div class='designer-placeholder'>No models yet. Be the first creator to upload one.</div>";return;}
    grid.innerHTML=models.map(modelCard).join("");
    $$(".model-card").forEach(card=>card.onclick=()=>openModel(card.dataset.id));
  }catch(e){grid.innerHTML=`<div class='designer-placeholder'>${e.message}</div>`}
}

function modelCard(m){
  return `<article class="model-card" data-id="${m.id}">
    <div class="thumb">${m.imageUrl?`<img src="${m.imageUrl}" alt="">`:`<div class="fake-model">◇</div>`}
      <span class="price ${m.type==="free"?"free":""}">${m.type==="free"?"FREE":"$"+Number(m.price).toFixed(2)}</span>
    </div>
    <div class="card-body"><div class="card-title">${esc(m.title)}</div>
    <div class="meta"><span>♥ ${m.likes||0}</span><span>↓ ${m.downloads||0}</span><span>${esc(m.category)}</span></div></div>
  </article>`;
}

async function openModel(id){
  const m=await api("/api/models/"+id);
  const modal=$("#modal"); modal.classList.remove("hidden");
  modal.innerHTML=`<div class="modal-box">
    <button class="modal-close" id="close">×</button>
    <span class="eyebrow">${esc(m.category)}</span><h2>${esc(m.title)}</h2>
    <p style="color:#8f989f;line-height:1.6">${esc(m.description||"No description.")}</p>
    <div class="meta"><span>Designer: ${esc(m.designerName)}</span><span>↓ ${m.downloads||0}</span></div>
    <div style="margin:20px 0"><b>${m.type==="free"?"Free":"$"+Number(m.price).toFixed(2)+" USD"}</b> · ${esc(m.originalFileName)}</div>
    <div class="form-actions"><button class="btn ghost" id="like">♥ ${m.likes||0}</button><button class="btn ghost" id="fav">☆ Save</button><button class="btn primary" id="download">${m.type==="free"?"Download":"Buy & Download"}</button></div>
    <div id="buyMsg" class="error"></div>
  </div>`;
  $("#close").onclick=()=>modal.classList.add("hidden");
  $("#like").onclick=async()=>{if(!token())return showAuth("login");const r=await api("/api/models/"+id+"/like",{method:"POST"});$("#like").textContent=`♥ ${r.likes}`};
  $("#fav").onclick=async()=>{if(!token())return showAuth("login");const r=await api("/api/models/"+id+"/favorite",{method:"POST"});$("#fav").textContent=r.favorite?"★ Saved":"☆ Save"};
  $("#download").onclick=async()=>{if(!token())return showAuth("login");try{const r=await api("/api/purchase/"+id,{method:"POST"});window.open(r.downloadUrl,"_blank");}catch(e){$("#buyMsg").textContent=e.message}};
}

function showAuth(mode){
  const modal=$("#modal");modal.classList.remove("hidden");
  modal.innerHTML=`<div class="modal-box"><button class="modal-close" id="close">×</button><span class="eyebrow">${mode==="login"?"WELCOME BACK":"JOIN MARKETPLACE3D"}</span><h2>${mode==="login"?"Log in":"Create your account"}</h2>
  <form class="form" id="authForm">${mode==="register"?`<label>Name<input name="name" required></label>`:""}<label>Email<input name="email" type="email" required></label><label>Password<input name="password" type="password" minlength="6" required></label><div id="authError" class="error"></div><div class="form-actions"><button type="button" class="btn ghost" id="switch">${mode==="login"?"Create account":"Log in instead"}</button><button class="btn primary">${mode==="login"?"Log in":"Sign up"}</button></div></form></div>`;
  $("#close").onclick=()=>modal.classList.add("hidden");
  $("#switch").onclick=()=>showAuth(mode==="login"?"register":"login");
  $("#authForm").onsubmit=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.target));try{const r=await api("/api/"+(mode==="login"?"login":"register"),{method:"POST",body});localStorage.setItem("m3d_token",r.token);location.reload()}catch(err){$("#authError").textContent=err.message}};
}

function showUpload(){
  if(!state.user)return showAuth("login");
  const modal=$("#modal");modal.classList.remove("hidden");
  modal.innerHTML=`<div class="modal-box" style="width:min(620px,100%)"><button class="modal-close" id="close">×</button><span class="eyebrow">CREATOR STUDIO</span><h2>Upload a 3D model</h2>
  <form class="form" id="uploadForm" enctype="multipart/form-data"><label>Model title<input name="title" required></label><div class="row"><label>Category<select name="category"><option>Home & Decor</option><option>Car Parts</option><option>Tools</option><option>Electronics</option><option>Toys & Games</option><option>Art</option><option>Other</option></select></label><label>Type<select name="type" id="type"><option value="free">Free</option><option value="paid">Paid</option></select></label></div><label>Price in USD<input name="price" id="price" type="number" step=".01" min="0" value="0"></label><label>Tags<input name="tags" placeholder="car, bracket, print"></label><label>Description<textarea name="description"></textarea></label><label>3D file<input name="modelFile" type="file" accept=".stl,.obj,.3mf,.zip,.step,.stp" required></label><label>Cover image<input name="image" type="file" accept="image/*"></label><div id="uploadError" class="error"></div><div class="form-actions"><button type="button" class="btn ghost" id="cancel">Cancel</button><button class="btn primary">Publish model</button></div></form></div>`;
  $("#close").onclick=$("#cancel").onclick=()=>modal.classList.add("hidden");
  $("#type").onchange=e=>$("#price").disabled=e.target.value==="free";
  $("#price").disabled=true;
  $("#uploadForm").onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);try{await api("/api/models",{method:"POST",body:fd});modal.classList.add("hidden");loadModels()}catch(err){$("#uploadError").textContent=err.message}};
}

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

$("#loginBtn").onclick=()=>showAuth("login");
$("#registerBtn").onclick=()=>showAuth("register");
$("#uploadCta").onclick=showUpload;
$("#searchBtn").onclick=()=>{state.q=$("#heroSearch").value.trim();loadModels();location.hash="discover"};
$("#heroSearch").onkeydown=e=>{if(e.key==="Enter")$("#searchBtn").click()};
$("#headerSearch").onkeydown=e=>{if(e.key==="Enter"){state.q=e.target.value.trim();loadModels();location.hash="discover"}};
$$("[data-search]").forEach(b=>b.onclick=()=>{state.q=b.dataset.search;$("#headerSearch").value=state.q;loadModels();location.hash="discover"});
$$("[data-category]").forEach(b=>b.onclick=()=>{state.category=b.dataset.category;loadModels();location.hash="discover"});
$$("[data-sort]").forEach(b=>b.onclick=()=>{$$("[data-sort]").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.sort=b.dataset.sort;loadModels()});

loadMe().then(loadModels);

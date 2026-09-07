async function api(url, options={}){const r=await fetch(url,options);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Erreur");return d}
const grid=document.getElementById("modelGrid"), search=document.getElementById("searchInput"), authLink=document.getElementById("authLink"), mobileMenu=document.getElementById("mobileMenu");
let state={category:"",q:""};
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function card(m){return `<article class="model-card"><a href="/model.html?id=${encodeURIComponent(m.id)}"><div class="thumb"><img src="${m.thumbnail||'/images/models/ghost.svg'}" alt=""><span class="badge">${m.category||"3D"}</span></div><div class="model-body"><div class="model-title">${esc(m.title)}</div><a class="creator" href="/profile.html?username=${encodeURIComponent(m.creator.username)}">@${esc(m.creator.username)}</a><div class="model-meta"><span>♥ ${m.likes||0} · ↓ ${m.downloads||0}</span><span class="price">${m.price>0?"$"+Number(m.price).toFixed(2):"FREE"}</span></div></div></a></article>`}
async function load(){try{const d=await api(`/api/models?category=${encodeURIComponent(state.category)}&q=${encodeURIComponent(state.q)}`);grid.innerHTML=d.models.length?d.models.map(card).join(""):`<div class="loading">Aucun modèle trouvé.</div>`}catch(e){grid.innerHTML=`<div class="loading">${esc(e.message)}</div>`}}
async function init(){
  try{
    const me=await api("/api/me");
    if(me.user){
      authLink.textContent="@"+me.user.username;
      authLink.href="/profile.html?username="+encodeURIComponent(me.user.username);
      const registerLink=document.getElementById("registerLink");
      if(registerLink) registerLink.style.display="none";
    }
  }catch{}
  load();
}
document.querySelectorAll(".pill").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".pill").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.category=b.dataset.category||"";load()}));
let timer;search?.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(()=>{state.q=search.value.trim();load()},250)});
mobileMenu?.addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
init();

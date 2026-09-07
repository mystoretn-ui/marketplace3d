async function api(url, options={}){const r=await fetch(url,options);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Erreur");return d}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
(async()=>{
try{
  const d=await api("/api/dashboard");
  document.getElementById("profileLink").href="/profile.html?username="+encodeURIComponent(d.user.username);
  document.getElementById("logoutBtn")?.addEventListener("click",async()=>{await api("/api/logout",{method:"POST"});window.location.href="/";});
document.getElementById("stats").innerHTML=`<div class="stat"><b>${d.models.length}</b><span>Modèles</span></div><div class="stat"><b>${d.totalDownloads}</b><span>Téléchargements</span></div><div class="stat"><b>$${d.gross.toFixed(2)}</b><span>Ventes brutes</span></div><div class="stat"><b>$${d.net.toFixed(2)}</b><span>Net créateur (81%)</span></div>`;document.getElementById("myModels").innerHTML=d.models.map(m=>`<article class="model-card"><a href="/model.html?id=${m.id}"><div class="thumb"><img src="${m.thumbnail}"></div><div class="model-body"><div class="model-title">${esc(m.title)}</div><div class="model-meta"><span>${m.downloads} téléchargements</span><span class="price">${m.price?"$"+Number(m.price).toFixed(2):"FREE"}</span></div></div></a></article>`).join("")||"<div class='loading'>Aucun modèle.</div>"}catch(e){document.querySelector(".dashboard-page").innerHTML=`<div class="loading">${esc(e.message)}<br><a href="/login.html">Se connecter</a></div>`}})();

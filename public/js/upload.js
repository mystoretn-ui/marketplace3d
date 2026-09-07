async function api(url, options={}){const r=await fetch(url,options);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Erreur");return d}
const form=document.getElementById("uploadForm"), msg=document.getElementById("uploadMsg");
form.addEventListener("submit",async e=>{e.preventDefault();msg.textContent="Publication...";try{const d=await api("/api/models",{method:"POST",body:new FormData(form)});location.href="/model.html?id="+encodeURIComponent(d.model.id)}catch(x){msg.textContent=x.message}});

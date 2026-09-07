function toggleSidebar(){document.getElementById("sidebar").classList.toggle("open")}
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));b.classList.add("active")}));
document.querySelectorAll(".heart").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();b.textContent=b.textContent==="♡"?"♥":"♡"}));
function searchModels(){const q=document.getElementById("searchInput").value.toLowerCase().trim();document.querySelectorAll("#modelsGrid .model-card").forEach(c=>{c.style.display=(c.dataset.title||c.innerText).toLowerCase().includes(q)?"":"none"})}
function scrollCategories(){document.querySelector(".categories").scrollBy({left:350,behavior:"smooth"})}

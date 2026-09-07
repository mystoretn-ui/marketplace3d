async function api(url,options={}){const r=await fetch(url,options);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Erreur");return d}
(async()=>{
  const msg=document.getElementById("msg");
  const bioInput=document.getElementById("bio");
  const locationInput=document.getElementById("location");
  const websiteInput=document.getElementById("website");
  const instagramInput=document.getElementById("instagram");
  const youtubeInput=document.getElementById("youtube");
  const facebookInput=document.getElementById("facebook");
  const tiktokInput=document.getElementById("tiktok");
  try{
    const d=await api("/api/me");
    if(!d.user)throw new Error("Connectez-vous.");
    const u=d.user;
    document.getElementById("back").href="/profile.html?username="+encodeURIComponent(u.username);
    bioInput.value=u.bio||"";
    locationInput.value=u.location||"";
    websiteInput.value=u.website||"";
    instagramInput.value=u.social?.instagram||"";
    youtubeInput.value=u.social?.youtube||"";
    facebookInput.value=u.social?.facebook||"";
    tiktokInput.value=u.social?.tiktok||"";

    document.getElementById("editForm").onsubmit=async e=>{
      e.preventDefault();
      try{
        const af=document.getElementById("avatar").files[0];
        if(af){
          const fd=new FormData();
          fd.append("avatar",af);
          await api("/api/profile/avatar",{method:"POST",body:fd});
        }
        await api("/api/profile",{
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            bio:bioInput.value,
            location:locationInput.value,
            website:websiteInput.value,
            social:{
              instagram:instagramInput.value,
              youtube:youtubeInput.value,
              facebook:facebookInput.value,
              tiktok:tiktokInput.value
            }
          })
        });
        msg.textContent="Profil mis à jour.";
        setTimeout(()=>window.location.href="/profile.html?username="+encodeURIComponent(u.username),500);
      }catch(x){msg.textContent=x.message}
    }
  }catch(e){msg.textContent=e.message}
})();

import Link from "next/link";

const cats = ["Pour Vous","Tendance","Équipement de la maison","Jouets & jeux","Outils","Loisirs & DIY","Imprimante 3D","Art","Miniatures","Décor"];

const models = [
  ["Fantôme avec Ballon","3.8K","428","🟣"],
  ["Ensemble de mini-golf modulaire","2.1K","219","🟢"],
  ["Figurine 3D stylisée","5.4K","691","🟤"],
  ["Kit de carte d’avion F-15","1.7K","188","⚫"],
  ["Organiseur de bureau","3.2K","351","⚪"],
  ["Support de manette Gaming","2.8K","294","🔵"],
  ["Vase géométrique","1.9K","173","🟠"],
  ["Boîte à outils compacte","1.4K","126","🟡"],
];

export default function Home(){
 return <div className="mw">
   <aside className="side">
     <Link href="/" className="brand"><span>▣</span><b>Marketplace</b><small>3D</small></Link>
     <div className="collapse">◫</div>
     <div className="sideMain">
       <Link href="/explore" className="sideItem active">⌂ <span>Explorer</span></Link>
       <Link href="/makerlab" className="sideItem">◇ <span>MakerLab</span></Link>
       <Link href="/contests" className="sideItem">🏆 <span>Concours</span></Link>
       <Link href="/funding" className="sideItem">▣ <span>Financement Participatif</span></Link>
       <div className="sideTitle">Explorer</div>
       <Link href="/supply" className="sideItem">▱ <span>Fournitures du Maker</span></Link>
       <Link href="/cyberbrick" className="sideItem">⬡ <span>CyberBrick</span></Link>
       <Link href="/community" className="sideItem">◎ <span>Communauté</span></Link>
       <Link href="/forum" className="sideItem">➤ <span>Forum</span></Link>
     </div>
     <div className="social">f　◎　▶　𝕏　♪</div>
     <div className="sideFoot"><div>Politique</div><div>Conditions d'Utilisation</div><div>Lignes Directrices FAQ</div><div>Paramètres des Cookies</div><div>Recherches Populaires</div><p>© 2026 Marketplace3D</p></div>
   </aside>

   <main className="main">
     <header className="top">
       <div className="search"><span>⌕</span><input placeholder="Recherchez des modèles, des utilisateurs, des collections et des publications"/></div>
       <div className="topActions"><span>◉</span><Link href="/login" className="identifyBtn">S'identifier</Link><Link href="/register" className="registerBtn">Inscription</Link></div>
     </header>

     <div className="scroll">
       <div className="chips">{cats.map((c,i)=><Link key={c} href={"/explore?category="+encodeURIComponent(c)} className={"chip "+(i===0?"chosen":"")}>{c}</Link>)}<button className="next">›</button></div>

       <section className="feature">
         <div className="promo">
           <div className="promoArt"><div className="bubble">Cute<span>Lab</span></div><p>YOUR 3D CUTTER TOOLKIT</p><strong>DESIGN. CUT. CREATE.</strong><em>LIFE TIME ACCESS</em></div>
           <div className="promoBottom"><b>Create Your Own Custom Cutters</b><span>━</span></div>
         </div>
         <div className="exploreMore">
           <h2>Explorer Plus</h2>
           <div className="plusGrid">
             <Link href="/makerlab"><b>MakerLab</b><span>Créez facilement, personnalisez...</span><i>🧊</i></Link>
             <Link href="/supply"><b>Maker's Supply</b><span>Pièces, kits et fournitures...</span><i>🛠️</i></Link>
             <Link href="/funding"><b>Financement participatif</b><span>Transformez vos idées</span><i>🌱</i></Link>
             <Link href="/cyberbrick"><b>CyberBrick</b><span>Concevez plus intelligemment</span><i>🤖</i></Link>
           </div>
         </div>
       </section>

       <div className="sectionTitle"><div><h1>Pour Vous</h1><p>Découvrez les modèles les plus intéressants de la communauté.</p></div><Link href="/explore">Voir plus ›</Link></div>

       <section className="cards">
        {models.map(([title,downloads,likes,icon])=><article className="model" key={title}>
          <Link href={"/model/"+title.toLowerCase().replaceAll(" ","-")}>
            <div className="thumb"><div className="fake3d">{icon}</div><button>♡</button><span className="badge">◈</span></div>
            <div className="modelInfo"><h3>{title}</h3><p>par <b>MakerStudio</b></p><div className="stats"><span>♡ {likes}</span><span>↓ {downloads}</span></div></div>
          </Link>
        </article>)}
       </section>
     </div>
   </main>
 </div>
}
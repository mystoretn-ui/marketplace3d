import Link from "next/link";

const categories = [
  ["All", "✦"], ["Home & Decor", "⌂"], ["Car Parts", "🚗"], ["Tools", "🔧"],
  ["Miniatures", "♟"], ["Toys & Games", "♟"], ["Gadgets", "⚙"], ["Art", "✺"]
];

const models = [
  { title: "Modern Desk Organizer", user: "PrintLab", category: "Home & Decor", downloads: "2.4K", likes: 312, image: "linear-gradient(135deg,#d9d9d9,#777)" },
  { title: "Wall Mount Bracket", user: "MakerPro", category: "Tools", downloads: "1.8K", likes: 201, image: "linear-gradient(135deg,#b9c0c8,#4b5563)" },
  { title: "Sport Car Phone Holder", user: "Auto3D", category: "Car Parts", downloads: "4.1K", likes: 527, image: "linear-gradient(135deg,#20242b,#777)" },
  { title: "Cute Robot Miniature", user: "TinyFactory", category: "Miniatures", downloads: "3.2K", likes: 418, image: "linear-gradient(135deg,#d7d7d7,#929292)" },
  { title: "Cable Management Set", user: "LayerWorks", category: "Gadgets", downloads: "1.1K", likes: 167, image: "linear-gradient(135deg,#c8c8c8,#5e5e5e)" },
  { title: "Geometric Vase", user: "FormStudio", category: "Home & Decor", downloads: "980", likes: 143, image: "linear-gradient(135deg,#ececec,#8b8b8b)" },
  { title: "Mechanical Gear Set", user: "ProtoMaker", category: "Tools", downloads: "2.7K", likes: 356, image: "linear-gradient(135deg,#aeb4bb,#30343a)" },
  { title: "Gaming Controller Stand", user: "PrintNest", category: "Gadgets", downloads: "1.5K", likes: 225, image: "linear-gradient(135deg,#dedede,#666)" }
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <Link href="/" className="logo"><span>◈</span> Marketplace<span className="logo3d">3D</span></Link>
        <div className="search"><span>⌕</span><input placeholder="Search 3D models..." /></div>
        <nav>
          <Link href="/explore">Explore</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/community">Community</Link>
        </nav>
        <Link href="/login" className="login">Log in</Link>
        <Link href="/register" className="signup">Sign up</Link>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">THE 3D CREATOR COMMUNITY</p>
          <h1>Discover. Create.<br/><span>Print it.</span></h1>
          <p className="heroText">Explore thousands of 3D models, share your creations, and build your own portfolio.</p>
          <div className="heroActions">
            <Link href="/explore" className="primary">Explore models →</Link>
            <Link href="/register" className="secondary">Start creating</Link>
          </div>
        </div>
        <div className="heroVisual">
          <div className="cube">◆</div>
          <div className="floating f1">STL</div>
          <div className="floating f2">3MF</div>
          <div className="floating f3">PRINT</div>
        </div>
      </section>

      <section className="content">
        <div className="sectionHead">
          <div><h2>Explore models</h2><p>Find your next print project.</p></div>
          <Link href="/explore" className="viewAll">View all →</Link>
        </div>

        <div className="categories">
          {categories.map(([name, icon], i) => <Link href={"/explore?category="+encodeURIComponent(name)} className={"category "+(i===0?"active":"")} key={name}><span>{icon}</span>{name}</Link>)}
        </div>

        <div className="grid">
          {models.map((m) => (
            <article className="card" key={m.title}>
              <Link href={"/model/"+m.title.toLowerCase().replaceAll(" ","-")}>
                <div className="modelImage" style={{background:m.image}}><div className="shape">◇</div><button className="heart">♡</button></div>
                <div className="cardBody">
                  <h3>{m.title}</h3>
                  <p className="creator">by <b>{m.user}</b></p>
                  <div className="meta"><span>♡ {m.likes}</span><span>↓ {m.downloads}</span><span className="tag">{m.category}</span></div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="creatorBanner">
        <div><p className="eyebrow">YOUR CREATOR SPACE</p><h2>Build your 3D portfolio.</h2><p>Upload your models, organize collections, gain followers and showcase your work.</p></div>
        <Link href="/register" className="primary">Create your profile →</Link>
      </section>

      <footer><div className="logo">◈ Marketplace<span className="logo3d">3D</span></div><p>© 2026 Marketplace3D · Built for makers.</p></footer>
    </main>
  );
}
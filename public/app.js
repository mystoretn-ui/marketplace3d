const models = [

  {
    title: "BMW E39 Front Bumper",
    creator: "AutoDesign",
    category: "carparts",
    type: "popular",
    icon: "🚗",
    price: "Free"
  },

  {
    title: "Car Dashboard Holder",
    creator: "PrintGarage",
    category: "carparts",
    type: "trending",
    icon: "🔧",
    price: "Free"
  },

  {
    title: "BMW E46 Air Vent",
    creator: "3D Auto Lab",
    category: "carparts",
    type: "new",
    icon: "⚙️",
    price: "$2.99"
  },

  {
    title: "Phone Holder",
    creator: "Maker Studio",
    category: "tools",
    type: "popular",
    icon: "📱",
    price: "Free"
  },

  {
    title: "Wall Planter",
    creator: "HomePrint",
    category: "home",
    type: "new",
    icon: "🪴",
    price: "Free"
  },

  {
    title: "Mechanical Gear",
    creator: "Engineering Lab",
    category: "tools",
    type: "trending",
    icon: "⚙️",
    price: "Free"
  },

  {
    title: "Cute Robot",
    creator: "MiniFactory",
    category: "miniatures",
    type: "popular",
    icon: "🤖",
    price: "$1.50"
  },

  {
    title: "Dragon Figure",
    creator: "FantasyPrint",
    category: "toys",
    type: "trending",
    icon: "🐉",
    price: "Free"
  },

  {
    title: "Modern Vase",
    creator: "DesignLab",
    category: "art",
    type: "new",
    icon: "🏺",
    price: "Free"
  },

  {
    title: "Car Key Holder",
    creator: "AutoMaker",
    category: "carparts",
    type: "trending",
    icon: "🔑",
    price: "Free"
  },

  {
    title: "LED Lamp",
    creator: "Creative3D",
    category: "home",
    type: "popular",
    icon: "💡",
    price: "$3.00"
  },

  {
    title: "RC Car Wheel",
    creator: "RC Factory",
    category: "carparts",
    type: "new",
    icon: "🛞",
    price: "Free"
  }

];


const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const modelsTitle = document.getElementById("modelsTitle");


let currentCategory = "all";
let currentTab = "all";


/* =========================
   DISPLAY MODELS
========================= */

function displayModels(){

  let result = [...models];


  /* CATEGORY FILTER */

  if(currentCategory !== "all"){

    result = result.filter(
      model => model.category === currentCategory
    );

  }


  /* TAB FILTER */

  if(currentTab !== "all"){

    result = result.filter(
      model => model.type === currentTab
    );

  }


  /* SEARCH */

  const search = searchInput.value
    .trim()
    .toLowerCase();

  if(search){

    result = result.filter(model =>

      model.title.toLowerCase().includes(search) ||

      model.creator.toLowerCase().includes(search) ||

      model.category.toLowerCase().includes(search)

    );

  }


  grid.innerHTML = "";


  if(result.length === 0){

    grid.innerHTML = `
      <div class="empty">
        No models found.
      </div>
    `;

    return;
  }


  result.forEach(model => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <div class="thumb">

        <div class="thumbVisual">
          ${model.icon}
        </div>

      </div>

      <div class="cardBody">

        <h3>
          ${model.title}
        </h3>

        <div class="muted">
          by ${model.creator}
        </div>

        <div class="price">
          ${model.price}
        </div>

      </div>

    `;


    card.addEventListener("click", () => {

      openModel(model);

    });


    grid.appendChild(card);

  });

}


/* =========================
   CATEGORY FILTER
========================= */

document
  .querySelectorAll(".categoryBar a")
  .forEach(link => {

    link.addEventListener("click", function(e){

      e.preventDefault();

      document
        .querySelectorAll(".categoryBar a")
        .forEach(item =>
          item.classList.remove("categoryActive")
        );

      this.classList.add("categoryActive");


      currentCategory =
        this.dataset.category;


      currentTab = "all";


      document
        .querySelectorAll(".modelTabs button")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      document
        .querySelector('.modelTabs button[data-tab="all"]')
        .classList.add("active");


      updateTitle();

      displayModels();

      scrollToModels();

    });

  });


/* =========================
   CATEGORY CARDS
========================= */

document
  .querySelectorAll(".categoryCard")
  .forEach(card => {

    card.addEventListener("click", function(){

      currentCategory =
        this.dataset.filter;

      currentTab = "all";


      document
        .querySelectorAll(".categoryBar a")
        .forEach(item =>
          item.classList.remove("categoryActive")
        );


      const matching =
        document.querySelector(
          `.categoryBar a[data-category="${currentCategory}"]`
        );


      if(matching){

        matching.classList.add(
          "categoryActive"
        );

      }


      document
        .querySelectorAll(".modelTabs button")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      document
        .querySelector('.modelTabs button[data-tab="all"]')
        .classList.add("active");


      updateTitle();

      displayModels();

    });

  });


/* =========================
   TABS
========================= */

document
  .querySelectorAll(".modelTabs button")
  .forEach(button => {

    button.addEventListener("click", function(){

      document
        .querySelectorAll(".modelTabs button")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      this.classList.add("active");


      currentTab =
        this.dataset.tab;


      displayModels();

    });

  });


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
  "input",
  displayModels
);


/* =========================
   UPDATE TITLE
========================= */

function updateTitle(){

  const names = {

    all: "Featured 3D Models",

    trending: "Trending Models",

    home: "Home & Decor",

    toys: "Toys & Games",

    tools: "Tools & Parts",

    carparts: "Car Parts",

    art: "Art & Design",

    miniatures: "Miniatures",

    electronics: "Electronics"

  };


  modelsTitle.textContent =
    names[currentCategory] ||
    "Featured 3D Models";

}


/* =========================
   SCROLL
========================= */

function scrollToModels(){

  document
    .getElementById("models")
    .scrollIntoView({
      behavior:"smooth"
    });

}


/* =========================
   MODEL MODAL
========================= */

function openModel(model){

  const modal =
    document.getElementById("modal");

  const content =
    document.getElementById("modalContent");


  content.innerHTML = `

    <div style="text-align:center">

      <div style="font-size:100px">
        ${model.icon}
      </div>

      <h2>
        ${model.title}
      </h2>

      <p class="muted">
        Created by ${model.creator}
      </p>

      <h3 style="color:#079ed5">
        ${model.price}
      </h3>

      <button
        class="primaryBtn"
        onclick="alert('Download system coming soon!')"
      >
        Download Model
      </button>

    </div>

  `;


  modal.classList.remove("hidden");

}


/* =========================
   LOGIN
========================= */

document
  .getElementById("loginBtn")
  .addEventListener("click", () => {

    const modal =
      document.getElementById("modal");

    const content =
      document.getElementById("modalContent");


    content.innerHTML = `

      <h2>Login</h2>

      <p class="muted">
        Login to your Marketplace3D account.
      </p>

      <input
        type="email"
        placeholder="Email"
      >

      <br><br>

      <input
        type="password"
        placeholder="Password"
      >

      <br><br>

      <button class="primaryBtn">
        Login
      </button>

    `;


    modal.classList.remove("hidden");

  });


/* =========================
   UPLOAD
========================= */

function openUpload(){

  const modal =
    document.getElementById("modal");

  const content =
    document.getElementById("modalContent");


  content.innerHTML = `

    <h2>
      Upload a 3D Model
    </h2>

    <p class="muted">
      Share your STL, 3MF or OBJ model.
    </p>

    <input
      type="text"
      placeholder="Model name"
    >

    <br><br>

    <select>

      <option>
        Select category
      </option>

      <option>
        Car Parts
      </option>

      <option>
        Home & Decor
      </option>

      <option>
        Toys & Games
      </option>

      <option>
        Tools
      </option>

      <option>
        Art
      </option>

      <option>
        Miniatures
      </option>

    </select>

    <br><br>

    <input
      type="file"
      accept=".stl,.3mf,.obj"
    >

    <br><br>

    <button
      class="primaryBtn"
      onclick="alert('Upload system coming soon!')"
    >
      Upload Model
    </button>

  `;


  modal.classList.remove("hidden");

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal(){

  document
    .getElementById("modal")
    .classList.add("hidden");

}


document
  .getElementById("modal")
  .addEventListener("click", function(e){

    if(e.target === this){

      closeModal();

    }

  });


/* =========================
   INITIAL LOAD
========================= */

displayModels();

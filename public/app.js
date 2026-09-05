/* =========================
   MODELS DATA
========================= */

const models = [

  {
    title: "BMW E39 Wide Body Kit",
    creator: "Car Accessories",
    category: "carparts",
    price: "Free",
    stats: "8.2k ♥",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "Sports Car Dashboard",
    creator: "AutoDesign",
    category: "carparts",
    price: "$2.99",
    stats: "5.4k ♥",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "Car Phone Holder",
    creator: "Maker Studio",
    category: "tools",
    price: "Free",
    stats: "12k ♥",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "Mechanical Gear Set",
    creator: "PrintLab",
    category: "tools",
    price: "Free",
    stats: "7.8k ♥",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "Modern Desk Organizer",
    creator: "Design3D",
    category: "home",
    price: "$1.99",
    stats: "4.2k ♥",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "Miniature Racing Car",
    creator: "MiniMaker",
    category: "miniatures",
    price: "Free",
    stats: "9.6k ♥",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "3D Printer Tool Box",
    creator: "PrintMaster",
    category: "printer",
    price: "$3.50",
    stats: "3.9k ♥",
    image:
      "https://images.unsplash.com/photo-1617005082139-4e9c2f7f4a1c?auto=format&fit=crop&w=900&q=85"
  },

  {
    title: "Decorative Geometric Vase",
    creator: "Creative3D",
    category: "home",
    price: "Free",
    stats: "6.1k ♥",
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=85"
  }

];


/* =========================
   DISPLAY MODELS
========================= */

const grid =
  document.getElementById("modelGrid");


function displayModels(list){

  grid.innerHTML = "";

  if(list.length === 0){

    grid.innerHTML = `
      <div style="
        grid-column:1/-1;
        padding:50px;
        text-align:center;
        color:#888;
      ">
        No models found.
      </div>
    `;

    return;
  }


  list.forEach(model => {

    const card =
      document.createElement("div");

    card.className = "modelCard";

    card.innerHTML = `

      <div class="modelImage">

        <img
          src="${model.image}"
          alt="${model.title}"
          loading="lazy"
        >

        <div class="modelBadge">
          3D
        </div>

      </div>

      <div class="modelBody">

        <h3>
          ${model.title}
        </h3>

        <div class="creator">
          ${model.creator}
        </div>

        <div class="modelBottom">

          <div class="stats">
            ${model.stats}
          </div>

          <div class="price">
            ${model.price}
          </div>

        </div>

      </div>

    `;


    card.addEventListener("click", () => {

      document.getElementById(
        "modalContent"
      ).innerHTML = `

        <h2>${model.title}</h2>

        <img
          src="${model.image}"
          style="
            width:100%;
            height:260px;
            object-fit:cover;
            border-radius:10px;
            margin:15px 0;
          "
        >

        <p>
          Created by <b>${model.creator}</b>
        </p>

        <p>
          This 3D model is available on Marketplace3D.
        </p>

        <button
          class="uploadBtn"
          style="margin-top:10px"
        >
          Download Model
        </button>

      `;

      document
        .getElementById("modal")
        .classList.remove("hidden");

    });


    grid.appendChild(card);

  });

}


displayModels(models);


/* =========================
   CATEGORY FILTER
========================= */

const categories =
  document.querySelectorAll(".category");


categories.forEach(button => {

  button.addEventListener("click", () => {

    categories.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    const category =
      button.dataset.category;


    if(
      category === "all" ||
      category === "trending"
    ){

      displayModels(models);

    }else{

      displayModels(
        models.filter(
          model =>
            model.category === category
        )
      );

    }

  });

});


/* =========================
   SEARCH
========================= */

const searchInput =
  document.getElementById("searchInput");


searchInput.addEventListener(
  "input",
  () => {

    const value =
      searchInput.value
        .toLowerCase()
        .trim();


    const filtered =
      models.filter(model =>

        model.title
          .toLowerCase()
          .includes(value)

        ||

        model.creator
          .toLowerCase()
          .includes(value)

        ||

        model.category
          .toLowerCase()
          .includes(value)

      );


    displayModels(filtered);

  }
);


/* =========================
   LOGIN
========================= */

function login(){

  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <h2>Login</h2>

    <p style="color:#777">
      Login to your Marketplace3D account.
    </p>

    <input
      type="email"
      placeholder="Email"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      "
    >

    <input
      type="password"
      placeholder="Password"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      "
    >

    <button
      class="uploadBtn"
      style="margin-top:10px"
    >
      Login
    </button>

  `;


  document
    .getElementById("modal")
    .classList.remove("hidden");

}


document
  .getElementById("loginBtn")
  .addEventListener(
    "click",
    login
  );


document
  .getElementById("loginTop")
  .addEventListener(
    "click",
    login
  );


/* =========================
   SIGN UP
========================= */

function signup(){

  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <h2>Create an account</h2>

    <p style="color:#777">
      Join Marketplace3D and start sharing your designs.
    </p>

    <input
      type="text"
      placeholder="Name / Username"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      "
    >

    <input
      type="email"
      placeholder="Email"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      "
    >

    <input
      type="password"
      placeholder="Password"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      "
    >

    <button
      class="uploadBtn"
      style="margin-top:10px"
    >
      Create Account
    </button>

  `;


  document
    .getElementById("modal")
    .classList.remove("hidden");

}


document
  .getElementById("signupTop")
  .addEventListener(
    "click",
    signup
  );


/* =========================
   UPLOAD
========================= */

function openUpload(){

  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <h2>Upload a 3D Model</h2>

    <p style="color:#777">
      Upload your STL, 3MF or OBJ file.
    </p>

    <input
      type="text"
      placeholder="Model name"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      "
    >

    <input
      type="file"
      accept=".stl,.3mf,.obj"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
      "
    >

    <button
      class="uploadBtn"
      style="margin-top:10px"
    >
      Upload Model
    </button>

  `;


  document
    .getElementById("modal")
    .classList.remove("hidden");

}


/* =========================
   MODAL CLOSE
========================= */

function closeModal(){

  document
    .getElementById("modal")
    .classList.add("hidden");

}


document
  .getElementById("modal")
  .addEventListener(
    "click",
    function(e){

      if(e.target === this){
        closeModal();
      }

    }
  );


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

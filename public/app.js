/* =========================
   MODELS DATA
========================= */

const models = [

  {
    name: "BMW E39 Wide Body Kit",
    creator: "BMW Accessories",
    category: "hobby",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    downloads: "714",
    likes: "407",
    price: "Free"
  },

  {
    name: "FlyGun 10125S",
    creator: "LUCKYCO",
    category: "toys",
    image:
      "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=900&q=80",
    downloads: "8.2k",
    likes: "5.8k",
    price: "Free"
  },

  {
    name: "3D Printer Tool Holder",
    creator: "Maker Studio",
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    downloads: "4.5k",
    likes: "2.1k",
    price: "Free"
  },

  {
    name: "Modern Desk Organizer",
    creator: "PrintLab",
    category: "home",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
    downloads: "12k",
    likes: "6.7k",
    price: "$2.99"
  },

  {
    name: "Cute Mini Figure",
    creator: "Bambu Studio",
    category: "toys",
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=900&q=80",
    downloads: "6.6k",
    likes: "3.9k",
    price: "Free"
  },

  {
    name: "Mechanical Engine",
    creator: "3D Engineer",
    category: "tools",
    image:
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=900&q=80",
    downloads: "5.4k",
    likes: "3.1k",
    price: "$4.50"
  },

  {
    name: "Decorative Vase",
    creator: "Creative Prints",
    category: "decor",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    downloads: "9.8k",
    likes: "4.8k",
    price: "Free"
  },

  {
    name: "Robot Miniature",
    creator: "Maker World",
    category: "miniatures",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    downloads: "3.2k",
    likes: "2k",
    price: "$1.99"
  }

];


/* =========================
   DISPLAY MODELS
========================= */

const grid = document.getElementById("modelGrid");


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

    const card = document.createElement("article");

    card.className = "modelCard";

    card.innerHTML = `

      <div class="modelImage">

        <img
          src="${model.image}"
          alt="${model.name}"
        >

        <button
          class="like"
          onclick="event.stopPropagation(); this.textContent='♥'"
        >
          ♡
        </button>

      </div>


      <div class="modelInfo">

        <h3>
          ${model.name}
        </h3>

        <div class="creator">
          ${model.creator}
        </div>

        <div class="stats">

          <span>
            ↓ ${model.downloads}
          </span>

          <span>
            ♡ ${model.likes}
          </span>

          <strong class="price">
            ${model.price}
          </strong>

        </div>

      </div>

    `;


    card.addEventListener("click", () => {

      alert(
        "Model: " + model.name +
        "\nCreator: " + model.creator
      );

    });


    grid.appendChild(card);

  });

}


/* INITIAL */

displayModels(models);


/* =========================
   SEARCH
========================= */

const searchInput =
  document.getElementById("searchInput");


searchInput.addEventListener("input", () => {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();


  const result = models.filter(model =>

    model.name.toLowerCase().includes(search) ||

    model.creator.toLowerCase().includes(search) ||

    model.category.toLowerCase().includes(search)

  );


  displayModels(result);

});


/* =========================
   CATEGORIES
========================= */

const categoryButtons =
  document.querySelectorAll(".category");


categoryButtons.forEach(button => {

  button.addEventListener("click", () => {

    categoryButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");


    const category =
      button.dataset.category;


    if(category === "all"){

      displayModels(models);

      return;

    }


    const filtered =
      models.filter(
        model => model.category === category
      );


    displayModels(filtered);

  });

});


/* =========================
   LOGIN
========================= */

const loginBtn =
  document.getElementById("loginBtn");

const loginModal =
  document.getElementById("loginModal");


loginBtn.addEventListener("click", () => {

  loginModal.classList.remove("hidden");

});


/* =========================
   UPLOAD
========================= */

const uploadModal =
  document.getElementById("uploadModal");


function openUpload(){

  uploadModal.classList.remove("hidden");

}


/* =========================
   CLOSE MODALS
========================= */

function closeModal(){

  document
    .querySelectorAll(".modal")
    .forEach(modal => {

      modal.classList.add("hidden");

    });

}


/* CLOSE WHEN CLICK OUTSIDE */

document
  .querySelectorAll(".modal")
  .forEach(modal => {

    modal.addEventListener("click", event => {

      if(event.target === modal){

        closeModal();

      }

    });

  });


/* ESC */

document.addEventListener("keydown", event => {

  if(event.key === "Escape"){

    closeModal();

  }

});

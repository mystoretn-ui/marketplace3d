/* =========================
   MARKETPLACE3D APP.JS
========================= */


/* =========================
   DEMO MODELS
========================= */

const models = [

  {
    id: "demo-bmw",
    title: "BMW E39 Wide Body Kit",
    creator: "Car Accessories",
    category: "carparts",
    price: "Free",
    stats: "8.2k ♥",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-dashboard",
    title: "Sports Car Dashboard",
    creator: "AutoDesign",
    category: "carparts",
    price: "$2.99",
    stats: "5.4k ♥",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-phone",
    title: "Car Phone Holder",
    creator: "Maker Studio",
    category: "tools",
    price: "Free",
    stats: "12k ♥",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-gear",
    title: "Mechanical Gear Set",
    creator: "PrintLab",
    category: "tools",
    price: "Free",
    stats: "7.8k ♥",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-desk",
    title: "Modern Desk Organizer",
    creator: "Design3D",
    category: "home",
    price: "$1.99",
    stats: "4.2k ♥",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-racing",
    title: "Miniature Racing Car",
    creator: "MiniMaker",
    category: "miniatures",
    price: "Free",
    stats: "9.6k ♥",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-toolbox",
    title: "3D Printer Tool Box",
    creator: "PrintMaster",
    category: "printer",
    price: "$3.50",
    stats: "3.9k ♥",
    image:
      "https://images.unsplash.com/photo-1617005082139-4e9c2f7f4a1c?auto=format&fit=crop&w=900&q=85"
  },

  {
    id: "demo-vase",
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
   REAL MODELS
========================= */

let realModels = [];


/* =========================
   DOM
========================= */

const grid =
  document.getElementById("modelGrid");


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {

  return String(value || "")
    .replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));

}


/* =========================
   GET ALL MODELS
========================= */

async function loadModels() {

  try {

    const response =
      await fetch("/api/models");


    if (!response.ok) {
      throw new Error("Could not load models.");
    }


    const data =
      await response.json();


    if (Array.isArray(data)) {

      realModels = data.map(model => ({

        ...model,

        creator:
          model.designerName ||
          model.creator ||
          "Designer",

        image:
          model.imageUrl ||
          model.image ||
          "",

        stats:
          model.stats ||
          "0 ♥"

      }));

    }


    const allModels = [
      ...realModels,
      ...models
    ];


    displayModels(allModels);


  } catch(error) {

    console.error(
      "Models loading error:",
      error
    );

    displayModels(models);

  }

}


/* =========================
   FIND DESIGNER USERNAME
========================= */

async function getDesignerUsername(
  model
) {

  if (model.username) {
    return model.username;
  }


  if (model.designerUsername) {
    return model.designerUsername;
  }


  if (!model.designerId) {
    return null;
  }


  try {

    const response =
      await fetch(
        "/api/users/" +
        encodeURIComponent(
          model.designerId
        )
      );


    if (!response.ok) {
      return null;
    }


    const user =
      await response.json();


    return (
      user?.profile?.username ||
      user?.username ||
      null
    );


  } catch {

    return null;

  }

}


/* =========================
   OPEN DESIGNER
========================= */

async function openDesignerForModel(
  model
) {

  if (model.designerId) {

    let username =
      model.designerUsername ||
      model.username;


    if (!username) {

      username =
        model.designerName ||
        model.creator;

    }


    if (username) {

      window.location.href =
        "/portfolio.html?username=" +
        encodeURIComponent(username);

      return;

    }

  }


  alert(
    "This is a demo designer profile."
  );

}


/* =========================
   DISPLAY MODELS
========================= */

function displayModels(list) {

  if (!grid) {
    return;
  }


  grid.innerHTML = "";


  if (!list.length) {

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


    card.className =
      "modelCard";


    const image =
      model.image ||
      model.imageUrl ||
      "";


    const title =
      model.title ||
      "Untitled model";


    const creator =
      model.creator ||
      model.designerName ||
      "Designer";


    const category =
      model.category ||
      "Other";


    let price =
      model.price;


    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {

      price = "Free";

    }


    if (
      typeof price === "number"
    ) {

      price =
        price > 0
          ? "$" + price.toFixed(2)
          : "Free";

    }


    card.innerHTML = `

      <div class="modelImage">

        ${
          image

          ? `

            <img
              src="${escapeHtml(image)}"
              alt="${escapeHtml(title)}"
              loading="lazy"
            >

          `

          : `

            <div style="
              width:100%;
              height:100%;
              display:flex;
              align-items:center;
              justify-content:center;
              color:#999;
              font-weight:700;
            ">
              3D MODEL
            </div>

          `
        }


        <div class="modelBadge">
          3D
        </div>

      </div>


      <div class="modelBody">

        <h3>
          ${escapeHtml(title)}
        </h3>


        <div
          class="creator"
          style="
            cursor:pointer;
            color:#079ed5;
            font-weight:600;
          "
        >
          ${escapeHtml(creator)}
        </div>


        <div class="modelBottom">

          <div class="stats">

            ${
              model.stats ||
              "0 ♥"
            }

          </div>


          <div class="price">

            ${escapeHtml(
              String(price)
            )}

          </div>

        </div>

      </div>

    `;


    const creatorElement =
      card.querySelector(
        ".creator"
      );


    if (creatorElement) {

      creatorElement.addEventListener(
        "click",
        async event => {

          event.stopPropagation();

          await openDesignerForModel(
            model
          );

        }
      );

    }


    card.addEventListener(
      "click",
      () => {

        openModelModal(model);

      }
    );


    grid.appendChild(card);

  });

}


/* =========================
   MODEL MODAL
========================= */

function openModelModal(model) {

  const modalContent =
    document.getElementById(
      "modalContent"
    );


  const modal =
    document.getElementById(
      "modal"
    );


  if (
    !modalContent ||
    !modal
  ) {

    return;

  }


  const image =
    model.image ||
    model.imageUrl ||
    "";


  const title =
    model.title ||
    "Untitled model";


  const creator =
    model.creator ||
    model.designerName ||
    "Designer";


  modalContent.innerHTML = `

    <h2>
      ${escapeHtml(title)}
    </h2>


    ${
      image

      ? `

        <img
          src="${escapeHtml(image)}"
          alt="${escapeHtml(title)}"
          style="
            width:100%;
            height:260px;
            object-fit:cover;
            border-radius:10px;
            margin:15px 0;
          "
        >

      `

      : ""

    }


    <p>

      Created by

      <b
        id="modalDesigner"
        style="
          color:#079ed5;
          cursor:pointer;
        "
      >
        ${escapeHtml(creator)}
      </b>

    </p>


    <p>
      This 3D model is available
      on Marketplace3D.
    </p>


    <button
      id="downloadModelBtn"
      class="uploadBtn"
      style="margin-top:10px"
    >
      Download Model
    </button>

  `;


  const designerButton =
    document.getElementById(
      "modalDesigner"
    );


  if (designerButton) {

    designerButton.onclick =
      async event => {

        event.stopPropagation();

        await openDesignerForModel(
          model
        );

      };

  }


  const downloadButton =
    document.getElementById(
      "downloadModelBtn"
    );


  if (downloadButton) {

    downloadButton.onclick =
      () => {

        downloadModel(model);

      };

  }


  modal
    .classList
    .remove("hidden");

}


/* =========================
   DOWNLOAD MODEL
========================= */

async function downloadModel(
  model
) {

  const token =
    localStorage.getItem(
      "token"
    );


  if (!model.designerId) {

    alert(
      "This demo model cannot be downloaded yet."
    );

    return;

  }


  if (!token) {

    alert(
      "Please login before downloading."
    );

    return;

  }


  try {

    const response =
      await fetch(
        "/api/purchase/" +
        encodeURIComponent(
          model.id
        ),
        {

          method: "POST",

          headers: {

            Authorization:
              "Bearer " +
              token

          }

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(
        data.error ||
        "Download failed."
      );

      return;

    }


    if (data.downloadUrl) {

      window.location.href =
        data.downloadUrl;

    }


  } catch {

    alert(
      "Server connection error."
    );

  }

}
/* =========================================================
   MARKETPLACE3D - APP.JS
   ========================================================= */


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let allModels = [];
let currentModels = [];
let currentCategory = "all";


/* =========================================================
   HELPERS
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
}


function formatPrice(price) {

  const number = Number(price || 0);

  if (number <= 0) {
    return "Free";
  }

  return number.toFixed(2) + " $";
}


function getModelId(model) {

  return (
    model.id ||
    model._id ||
    model.modelId ||
    ""
  );

}


function getModelTitle(model) {

  return (
    model.title ||
    model.name ||
    "Untitled Model"
  );

}


function getModelImage(model) {

  return (
    model.imageUrl ||
    model.image ||
    model.thumbnail ||
    model.thumbnailUrl ||
    ""
  );

}


function getModelCategory(model) {

  return (
    model.category ||
    "Other"
  );

}


function getModelDescription(model) {

  return (
    model.description ||
    "3D printable model."
  );

}


function getDesignerName(model) {

  if (typeof model.designer === "string") {
    return model.designer;
  }

  if (model.designer && typeof model.designer === "object") {

    return (
      model.designer.name ||
      model.designer.username ||
      "Designer"
    );

  }

  return (
    model.designerName ||
    model.creatorName ||
    model.author ||
    "Designer"
  );

}


function getDesignerUsername(model) {

  if (model.designer && typeof model.designer === "object") {

    return (
      model.designer.username ||
      ""
    );

  }

  return (
    model.designerUsername ||
    model.username ||
    model.creatorUsername ||
    ""
  );

}


/* =========================================================
   API
   ========================================================= */

async function apiRequest(url, options = {}) {

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {

    throw new Error(
      data?.error ||
      data?.message ||
      "Server error"
    );

  }

  return data;

}


/* =========================================================
   LOAD MODELS
   ========================================================= */

async function loadModels() {

  const grid =
    document.getElementById("modelGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = `
    <div class="loading">
      Loading models...
    </div>
  `;


  try {

    const data =
      await apiRequest("/api/models");


    if (Array.isArray(data)) {

      allModels = data;

    } else if (Array.isArray(data.models)) {

      allModels = data.models;

    } else if (Array.isArray(data.data)) {

      allModels = data.data;

    } else {

      allModels = [];

    }


    currentModels = [...allModels];

    renderModels(currentModels);


  } catch (error) {

    console.error(
      "LOAD MODELS ERROR:",
      error
    );


    grid.innerHTML = `
      <div class="loading">
        No models available yet.
      </div>
    `;

  }

}


/* =========================================================
   RENDER MODELS
   ========================================================= */

function renderModels(models) {

  const grid =
    document.getElementById("modelGrid");

  if (!grid) {
    return;
  }


  if (!models || !models.length) {

    grid.innerHTML = `
      <div class="loading">
        No models found.
      </div>
    `;

    return;
  }


  grid.innerHTML = models.map(function (model) {

    const id =
      getModelId(model);

    const title =
      getModelTitle(model);

    const image =
      getModelImage(model);

    const category =
      getModelCategory(model);

    const designer =
      getDesignerName(model);

    const price =
      formatPrice(model.price);


    return `

      <article
        class="card"
        data-model-id="${escapeHtml(id)}"
        onclick="openModel('${escapeHtml(id)}')"
      >

        <div class="thumb">

          ${
            image

              ? `
                <img
                  src="${escapeHtml(image)}"
                  alt="${escapeHtml(title)}"
                  loading="lazy"
                  onerror="this.style.display='none'; this.parentElement.classList.add('imageError');"
                >
              `

              : `
                <div class="noImage">
                  3D
                </div>
              `
          }

        </div>


        <div class="cardBody">

          <h3>
            ${escapeHtml(title)}
          </h3>


          <div class="muted">
            ${escapeHtml(category)}
          </div>


          <div class="cardBottom">

            <span class="designerName">
              ${escapeHtml(designer)}
            </span>

            <strong class="price">
              ${escapeHtml(price)}
            </strong>

          </div>

        </div>

      </article>

    `;

  }).join("");

}


/* =========================================================
   OPEN MODEL
   ========================================================= */

function openModel(id) {

  if (!id) {
    return;
  }


  /*
    نحاولو نستعملو modal أولاً
    وإذا ما خدمش، نعملو URL model
  */

  const model =
    allModels.find(function (item) {

      return String(
        getModelId(item)
      ) === String(id);

    });


  if (model) {

    openModelModal(model);

    return;

  }


  window.location.href =
    "/?model=" +
    encodeURIComponent(id);

}


/* =========================================================
   MODEL MODAL
   ========================================================= */

function openModelModal(model) {

  const modal =
    document.getElementById("modal");

  const content =
    document.getElementById("modalContent");


  if (!modal || !content) {

    window.location.href =
      "/?model=" +
      encodeURIComponent(
        getModelId(model)
      );

    return;

  }


  const title =
    getModelTitle(model);

  const image =
    getModelImage(model);

  const description =
    getModelDescription(model);

  const category =
    getModelCategory(model);

  const designer =
    getDesignerName(model);

  const price =
    formatPrice(model.price);


  content.innerHTML = `

    <div class="modelModal">

      ${
        image

          ? `
            <img
              class="modalImage"
              src="${escapeHtml(image)}"
              alt="${escapeHtml(title)}"
            >
          `

          : `
            <div class="modalImage noImage">
              3D
            </div>
          `
      }


      <div class="modalInfo">

        <small>
          ${escapeHtml(category)}
        </small>


        <h2>
          ${escapeHtml(title)}
        </h2>


        <p class="modalDesigner">
          By ${escapeHtml(designer)}
        </p>


        <p>
          ${escapeHtml(description)}
        </p>


        <div class="modalPrice">
          ${escapeHtml(price)}
        </div>


        <div class="modalActions">

          ${
            model.fileUrl

              ? `
                <a
                  class="downloadBtn"
                  href="${escapeHtml(model.fileUrl)}"
                  download
                >
                  Download
                </a>
              `

              : `
                <button
                  class="downloadBtn"
                  onclick="downloadModel('${escapeHtml(getModelId(model))}')"
                >
                  Download
                </button>
              `
          }

        </div>

      </div>

    </div>

  `;


  modal.classList.remove("hidden");

}


/* =========================================================
   DOWNLOAD MODEL
   ========================================================= */

async function downloadModel(id) {

  if (!id) {
    return;
  }


  try {

    window.location.href =
      "/api/models/" +
      encodeURIComponent(id) +
      "/download";

  } catch (error) {

    console.error(error);

  }

}


/* =========================================================
   MODAL
   ========================================================= */

function closeModal() {

  const modal =
    document.getElementById("modal");

  if (modal) {

    modal.classList.add("hidden");

  }

}


document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeModal();

    }

  }
);


document.addEventListener(
  "click",
  function (event) {

    const modal =
      document.getElementById("modal");

    if (!modal) {
      return;
    }


    if (
      event.target === modal
    ) {

      closeModal();

    }

  }
);


/* =========================================================
   SEARCH
   ========================================================= */

function searchModels(value) {

  const search =
    String(value || "")
      .trim()
      .toLowerCase();


  let filtered =
    [...allModels];


  if (search) {

    filtered =
      filtered.filter(function (model) {

        const title =
          getModelTitle(model)
            .toLowerCase();

        const category =
          getModelCategory(model)
            .toLowerCase();

        const designer =
          getDesignerName(model)
            .toLowerCase();

        const description =
          getModelDescription(model)
            .toLowerCase();


        return (
          title.includes(search) ||
          category.includes(search) ||
          designer.includes(search) ||
          description.includes(search)
        );

      });

  }


  currentModels =
    filtered;


  renderModels(currentModels);

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function filterByCategory(category) {

  currentCategory =
    category || "all";


  let filtered =
    [...allModels];


  if (
    currentCategory !== "all"
  ) {

    if (
      currentCategory === "trending"
    ) {

      filtered =
        filtered
          .filter(function (model) {

            return (
              model.trending === true ||
              model.isTrending === true
            );

          });


    } else {

      filtered =
        filtered.filter(function (model) {

          const modelCategory =
            getModelCategory(model)
              .toLowerCase();

          const wanted =
            String(
              currentCategory
            ).toLowerCase();


          return (
            modelCategory === wanted ||
            modelCategory.includes(wanted)
          );

        });

    }

  }


  currentModels =
    filtered;


  renderModels(currentModels);

}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategories() {

  const buttons =
    document.querySelectorAll(
      ".category"
    );


  buttons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        buttons.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        const category =
          button.dataset.category ||
          "all";


        filterByCategory(
          category
        );

      }
    );

  });

}


/* =========================================================
   SEARCH INPUT
   ========================================================= */

function setupSearch() {

  const input =
    document.getElementById(
      "searchInput"
    );


  if (!input) {
    return;
  }


  input.addEventListener(
    "input",
    function () {

      searchModels(
        input.value
      );

    }
  );


  input.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter"
      ) {

        searchModels(
          input.value
        );

      }

    }
  );

}


/* =========================================================
   SCROLL TO MODELS
   ========================================================= */

function scrollToModels() {

  const section =
    document.getElementById(
      "models"
    );


  if (!section) {
    return;
  }


  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =========================================================
   UPLOAD
   ========================================================= */

function openUpload() {

  /*
    في البداية نبعثو المستخدم للـlogin
    إذا ما هوش connecté.
  */

  window.location.href =
    "/?upload=true";

}


/* =========================================================
   LOGIN
   ========================================================= */

function openLogin() {

  /*
    إذا عندك login page في السيرفر
    بدّل المسار هنا فقط.
  */

  window.location.href =
    "/login";

}


/* =========================================================
   SIGN UP
   ========================================================= */

function openSignup() {

  window.location.href =
    "/signup";

}


/* =========================================================
   AUTH BUTTONS
   ========================================================= */

function setupAuthButtons() {

  const sideLogin =
    document.getElementById(
      "loginBtn"
    );

  const topLogin =
    document.getElementById(
      "loginTop"
    );

  const signup =
    document.getElementById(
      "signupTop"
    );


  if (sideLogin) {

    sideLogin.addEventListener(
      "click",
      openLogin
    );

  }


  if (topLogin) {

    topLogin.addEventListener(
      "click",
      openLogin
    );

  }


  if (signup) {

    signup.addEventListener(
      "click",
      openSignup
    );

  }

}


/* =========================================================
   VIEW ALL
   ========================================================= */

function setupViewAll() {

  const button =
    document.querySelector(
      ".viewAll"
    );


  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    function () {

      const categoryButtons =
        document.querySelectorAll(
          ".category"
        );


      categoryButtons.forEach(
        function (item) {

          item.classList.remove(
            "active"
          );

        }
      );


      const allButton =
        document.querySelector(
          '.category[data-category="all"]'
        );


      if (allButton) {

        allButton.classList.add(
          "active"
        );

      }


      currentCategory =
        "all";

      currentModels =
        [...allModels];


      renderModels(
        currentModels
      );


      scrollToModels();

    }
  );

}


/* =========================================================
   MODEL FROM URL
   ========================================================= */

function checkModelFromUrl() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const modelId =
    params.get("model");


  if (!modelId) {
    return;
  }


  const model =
    allModels.find(
      function (item) {

        return String(
          getModelId(item)
        ) === String(modelId);

      }
    );


  if (model) {

    openModelModal(
      model
    );

  }

}


/* =========================================================
   USER / AUTH STATUS
   ========================================================= */

async function checkAuth() {

  try {

    const data =
      await apiRequest(
        "/api/auth/me"
      );


    if (!data) {
      return;
    }


    updateAuthUI(data);


  } catch (error) {

    /*
      عادي إذا route متاع auth/me
      مازال موش موجود.
    */

    console.log(
      "Auth check:",
      error.message
    );

  }

}


/* =========================================================
   UPDATE AUTH UI
   ========================================================= */

function updateAuthUI(data) {

  const username =
    data.username ||
    data.user?.username ||
    data.name ||
    data.user?.name;


  if (!username) {
    return;
  }


  const loginButtons =
    document.querySelectorAll(
      "#loginBtn, #loginTop"
    );


  loginButtons.forEach(
    function (button) {

      button.textContent =
        username;

    }
  );


  const signup =
    document.getElementById(
      "signupTop"
    );


  if (signup) {

    signup.textContent =
      "Account";

  }

}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function init() {

  setupCategories();

  setupSearch();

  setupAuthButtons();

  setupViewAll();

  await loadModels();

  checkModelFromUrl();

  checkAuth();

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openModel =
  openModel;

window.closeModal =
  closeModal;

window.openUpload =
  openUpload;

window.scrollToModels =
  scrollToModels;

window.downloadModel =
  downloadModel;

window.searchModels =
  searchModels;

window.filterByCategory =
  filterByCategory;

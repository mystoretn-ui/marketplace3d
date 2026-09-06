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


    /*
      Demo models remain visible.
      Real uploaded models are added
      to the marketplace.
    */

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


    /*
      If server is unavailable,
      keep the demo models.
    */

    displayModels(models);

  }

}


/* =========================
   FIND DESIGNER USERNAME
========================= */

async function getDesignerUsername(
  model
) {

  /*
    If server model already contains
    a username, use it directly.
  */

  if (model.username) {
    return model.username;
  }


  if (model.designerUsername) {
    return model.designerUsername;
  }


  /*
    Some models only have designerId.
    We ask the server for the user.
  */

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

  /*
    Real uploaded model
  */

  if (model.designerId) {

    /*
      First try username already
      available in model.
    */

    let username =
      model.designerUsername ||
      model.username;


    /*
      If not available, use
      designer name as fallback.
    */

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


  /*
    Demo model:
    no real account exists.
  */

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


    /* =========================
       CREATOR CLICK
    ========================= */

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


    /* =========================
       MODEL CLICK
    ========================= */

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


  /*
    Demo model
  */

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


/* =========================
   CATEGORY FILTER
========================= */

const categories =
  document.querySelectorAll(
    ".category"
  );


categories.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      categories.forEach(
        btn =>
          btn.classList.remove(
            "active"
          )
      );


      button.classList.add(
        "active"
      );


      const category =
        button.dataset.category;


      const allModels = [
        ...realModels,
        ...models
      ];


      if (
        category === "all" ||
        category === "trending"
      ) {

        displayModels(
          allModels
        );

        return;

      }


      displayModels(

        allModels.filter(
          model => {

            const modelCategory =
              String(
                model.category ||
                ""
              ).toLowerCase();


            return (
              modelCategory ===
              String(
                category
              ).toLowerCase()
            );

          }
        )

      );

    }
  );

});


/* =========================
   SEARCH
========================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );


if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      const value =
        searchInput.value
          .toLowerCase()
          .trim();


      const allModels = [
        ...realModels,
        ...models
      ];


      const filtered =
        allModels.filter(
          model => {

            const title =
              String(
                model.title || ""
              ).toLowerCase();


            const creator =
              String(
                model.creator ||
                model.designerName ||
                ""
              ).toLowerCase();


            const category =
              String(
                model.category ||
                ""
              ).toLowerCase();


            return (

              title.includes(value) ||

              creator.includes(value) ||

              category.includes(value)

            );

          }
        );


      displayModels(
        filtered
      );

    }
  );

}


/* =========================
   LOGIN
========================= */

function login() {

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


  modalContent.innerHTML = `

    <h2>
      Login
    </h2>


    <p style="color:#777">
      Login to your
      Marketplace3D account.
    </p>


    <input
      id="loginEmail"
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
      id="loginPassword"
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
      id="doLoginBtn"
      class="uploadBtn"
      style="margin-top:10px"
    >
      Login
    </button>


    <div
      id="loginMessage"
      style="
        margin-top:12px;
        font-size:13px;
      "
    ></div>

  `;


  modal
    .classList
    .remove("hidden");


  document
    .getElementById(
      "doLoginBtn"
    )
    .addEventListener(
      "click",
      async () => {

        const email =
          document
            .getElementById(
              "loginEmail"
            )
            .value
            .trim();


        const password =
          document
            .getElementById(
              "loginPassword"
            )
            .value;


        const message =
          document
            .getElementById(
              "loginMessage"
            );


        if (
          !email ||
          !password
        ) {

          message.textContent =
            "Please enter your email and password.";

          message.style.color =
            "#d33";

          return;

        }


        try {

          const response =
            await fetch(
              "/api/login",
              {

                method: "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({
                    email,
                    password
                  })

              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            message.textContent =
              data.error ||
              "Invalid email or password.";

            message.style.color =
              "#d33";

            return;

          }


          localStorage.setItem(
            "token",
            data.token
          );


          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );


          message.textContent =
            "Login successful!";

          message.style.color =
            "#159447";


          setTimeout(
            () => {

              closeModal();

              updateAuthUI();

            },
            500
          );


        } catch {

          message.textContent =
            "Server connection error.";

          message.style.color =
            "#d33";

        }

      }
    );

}


/* =========================
   SIGN UP
========================= */

function signup() {

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


  modalContent.innerHTML = `

    <h2>
      Create an account
    </h2>


    <p style="color:#777">
      Join Marketplace3D and
      start sharing your designs.
    </p>


    <input
      id="signupName"
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
      id="signupEmail"
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
      id="signupPassword"
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
      id="createAccountBtn"
      class="uploadBtn"
      style="margin-top:10px"
    >
      Create Account
    </button>


    <div
      id="signupMessage"
      style="
        margin-top:12px;
        font-size:13px;
      "
    ></div>

  `;


  modal
    .classList
    .remove("hidden");


  document
    .getElementById(
      "createAccountBtn"
    )
    .addEventListener(
      "click",
      async () => {

        const name =
          document
            .getElementById(
              "signupName"
            )
            .value
            .trim();


        const email =
          document
            .getElementById(
              "signupEmail"
            )
            .value
            .trim();


        const password =
          document
            .getElementById(
              "signupPassword"
            )
            .value;


        const message =
          document
            .getElementById(
              "signupMessage"
            );


        if (
          !name ||
          !email ||
          !password
        ) {

          message.textContent =
            "Please fill in all fields.";

          message.style.color =
            "#d33";

          return;

        }


        try {

          const response =
            await fetch(
              "/api/register",
              {

                method: "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({
                    name,
                    email,
                    password
                  })

              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            message.textContent =
              data.error ||
              "Registration failed.";

            message.style.color =
              "#d33";

            return;

          }


          localStorage.setItem(
            "token",
            data.token
          );


          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );


          message.textContent =
            "Account created successfully!";

          message.style.color =
            "#159447";


          setTimeout(
            () => {

              closeModal();

              updateAuthUI();

            },
            700
          );


        } catch {

          message.textContent =
            "Server connection error.";

          message.style.color =
            "#d33";

        }

      }
    );

}


/* =========================
   UPLOAD
========================= */

function openUpload() {

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


  const token =
    localStorage.getItem(
      "token"
    );


  if (!token) {

    login();

    return;

  }


  modalContent.innerHTML = `

    <h2>
      Upload a 3D Model
    </h2>


    <p style="color:#777">
      Upload your STL,
      3MF or OBJ file.
    </p>


    <input
      id="uploadTitle"
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
      id="uploadFile"
      type="file"
      accept=".stl,.3mf,.obj"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
      "
    >


    <button
      id="uploadModelBtn"
      class="uploadBtn"
      style="margin-top:10px"
    >
      Upload Model
    </button>


    <div
      id="uploadMessage"
      style="
        margin-top:12px;
        font-size:13px;
      "
    ></div>

  `;


  modal
    .classList
    .remove("hidden");


  document
    .getElementById(
      "uploadModelBtn"
    )
    .addEventListener(
      "click",
      async () => {

        const title =
          document
            .getElementById(
              "uploadTitle"
            )
            .value
            .trim();


        const file =
          document
            .getElementById(
              "uploadFile"
            )
            .files[0];


        const message =
          document
            .getElementById(
              "uploadMessage"
            );


        if (
          !title ||
          !file
        ) {

          message.textContent =
            "Please enter a model name and select a file.";

          message.style.color =
            "#d33";

          return;

        }


        const formData =
          new FormData();


        formData.append(
          "title",
          title
        );


        formData.append(
          "modelFile",
          file
        );


        try {

          const response =
            await fetch(
              "/api/models",
              {

                method: "POST",

                headers: {

                  Authorization:
                    "Bearer " +
                    token

                },

                body:
                  formData

              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            message.textContent =
              data.error ||
              "Upload failed.";

            message.style.color =
              "#d33";

            return;

          }


          message.textContent =
            "Model uploaded successfully!";

          message.style.color =
            "#159447";


          /*
            Add uploaded model
            immediately to the page.
          */

          realModels.unshift({

            ...data,

            creator:
              data.designerName ||
              "Designer",

            image:
              data.imageUrl ||
              "",

            stats:
              "0 ♥"

          });


          setTimeout(
            () => {

              closeModal();

              displayModels([
                ...realModels,
                ...models
              ]);

            },
            700
          );


        } catch {

          message.textContent =
            "Server connection error.";

          message.style.color =
            "#d33";

        }

      }
    );

}


/* =========================
   AUTH UI
========================= */

function updateAuthUI() {

  const token =
    localStorage.getItem(
      "token"
    );


  const userString =
    localStorage.getItem(
      "user"
    );


  let user = null;


  try {

    user =
      userString
        ? JSON.parse(
            userString
          )
        : null;

  } catch {

    user = null;

  }


  /*
    Optional top login button
  */

  const loginTop =
    document.getElementById(
      "loginTop"
    );


  if (loginTop) {

    if (token && user) {

      loginTop.textContent =
        user.name ||
        "Profile";


      loginTop.onclick =
        () => {

          window.location.href =
            "/portfolio.html?username=" +
            encodeURIComponent(
              user.name
            );

        };

    } else {

      loginTop.textContent =
        "Login";


      loginTop.onclick =
        login;

    }

  }


  /*
    Optional login sidebar button
  */

  const loginBtn =
    document.getElementById(
      "loginBtn"
    );


  if (loginBtn) {

    if (token && user) {

      loginBtn.textContent =
        user.name ||
        "Profile";


      loginBtn.onclick =
        () => {

          window.location.href =
            "/portfolio.html?username=" +
            encodeURIComponent(
              user.name
            );

        };

    } else {

      loginBtn.textContent =
        "Login";


      loginBtn.onclick =
        login;

    }

  }

}


/* =========================
   MODAL CLOSE
========================= */

function closeModal() {

  const modal =
    document.getElementById(
      "modal"
    );


  if (!modal) {
    return;
  }


  modal
    .classList
    .add("hidden");

}


/* =========================
   MODAL BACKDROP
========================= */

const modal =
  document.getElementById(
    "modal"
  );


if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        modal
      ) {

        closeModal();

      }

    }
  );

}


/* =========================
   LOGIN BUTTONS
========================= */

const loginBtn =
  document.getElementById(
    "loginBtn"
  );


if (loginBtn) {

  loginBtn.onclick =
    login;

}


const loginTop =
  document.getElementById(
    "loginTop"
  );


if (loginTop) {

  loginTop.onclick =
    login;

}


/* =========================
   SIGNUP BUTTON
========================= */

const signupTop =
  document.getElementById(
    "signupTop"
  );


if (signupTop) {

  signupTop.onclick =
    signup;

}


/* =========================
   UPLOAD BUTTONS
========================= */

const uploadTop =
  document.getElementById(
    "uploadTop"
  );


if (uploadTop) {

  uploadTop.onclick =
    openUpload;

}


/* =========================
   SCROLL TO MODELS
========================= */

function scrollToModels() {

  const modelsSection =
    document.getElementById(
      "models"
    );


  if (modelsSection) {

    modelsSection.scrollIntoView({
      behavior: "smooth"
    });

  }

}


/* =========================
   START APP
========================= */

updateAuthUI();

loadModels();

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

  if(!grid) return;

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

        <div
          class="creator"
          onclick="event.stopPropagation(); openDesigner('${encodeURIComponent(model.creator)}')"
          style="
            cursor:pointer;
            color:#079ed5;
            font-weight:600;
          "
        >
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


    /* =========================
       MODEL CLICK
    ========================= */

    card.addEventListener("click", () => {

      const modalContent =
        document.getElementById(
          "modalContent"
        );

      const modal =
        document.getElementById(
          "modal"
        );


      if(!modalContent || !modal){
        return;
      }


      modalContent.innerHTML = `

        <h2>
          ${model.title}
        </h2>

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
          Created by
          <b
            onclick="openDesigner('${encodeURIComponent(model.creator)}')"
            style="
              color:#079ed5;
              cursor:pointer;
            "
          >
            ${model.creator}
          </b>
        </p>

        <p>
          This 3D model is available
          on Marketplace3D.
        </p>

        <button
          class="uploadBtn"
          style="margin-top:10px"
        >
          Download Model
        </button>

      `;


      modal
        .classList
        .remove("hidden");

    });


    grid.appendChild(card);

  });

}


displayModels(models);


/* =========================
   DESIGNER PORTFOLIO
========================= */

function openDesigner(username){

  if(!username){
    return;
  }

  window.location.href =
    "/portfolio.html?username=" +
    username;

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

      categories.forEach(btn =>
        btn.classList.remove(
          "active"
        )
      );


      button.classList.add(
        "active"
      );


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
              model.category ===
              category
          )
        );

      }

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


if(searchInput){

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

}


/* =========================
   LOGIN
========================= */

function login(){

  const modalContent =
    document.getElementById(
      "modalContent"
    );

  const modal =
    document.getElementById(
      "modal"
    );


  if(!modalContent || !modal){
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


  modal
    .classList
    .remove("hidden");

}


const loginBtn =
  document.getElementById(
    "loginBtn"
  );


if(loginBtn){

  loginBtn.addEventListener(
    "click",
    login
  );

}


const loginTop =
  document.getElementById(
    "loginTop"
  );


if(loginTop){

  loginTop.addEventListener(
    "click",
    login
  );

}


/* =========================
   SIGN UP
========================= */

function signup(){

  const modalContent =
    document.getElementById(
      "modalContent"
    );

  const modal =
    document.getElementById(
      "modal"
    );


  if(!modalContent || !modal){
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


  /* =========================
     CREATE ACCOUNT
  ========================= */

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


        if(
          !name ||
          !email ||
          !password
        ){

          message.textContent =
            "Please fill in all fields.";

          message.style.color =
            "#d33";

          return;

        }


        try{

          const response =
            await fetch(
              "/api/register",
              {
                method:"POST",

                headers:{
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


          if(!response.ok){

            message.textContent =
              data.error ||
              "Registration failed.";

            message.style.color =
              "#d33";

            return;

          }


          /* SAVE LOGIN */

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


          setTimeout(() => {

            closeModal();

          }, 700);


        }catch(error){

          message.textContent =
            "Server connection error.";

          message.style.color =
            "#d33";

        }

      }
    );

}


const signupTop =
  document.getElementById(
    "signupTop"
  );


if(signupTop){

  signupTop.addEventListener(
    "click",
    signup
  );

}


/* =========================
   UPLOAD
========================= */

function openUpload(){

  const modalContent =
    document.getElementById(
      "modalContent"
    );

  const modal =
    document.getElementById(
      "modal"
    );


  if(!modalContent || !modal){
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


  /* =========================
     UPLOAD MODEL
  ========================= */

  document
    .getElementById(
      "uploadModelBtn"
    )
    .addEventListener(
      "click",
      async () => {

        const token =
          localStorage.getItem(
            "token"
          );


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


        if(!token){

          message.textContent =
            "Please login first.";

          message.style.color =
            "#d33";

          return;

        }


        if(!title || !file){

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


        try{

          const response =
            await fetch(
              "/api/models",
              {

                method:"POST",

                headers:{
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


          if(!response.ok){

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


          setTimeout(() => {

            closeModal();

            /*
              Reload models later
              from the server.
            */

          }, 800);


        }catch(error){

          message.textContent =
            "Server connection error.";

          message.style.color =
            "#d33";

        }

      }
    );

}


/* =========================
   MODAL CLOSE
========================= */

function closeModal(){

  const modal =
    document.getElementById(
      "modal"
    );


  if(!modal){
    return;
  }


  modal
    .classList
    .add("hidden");

}


const modal =
  document.getElementById(
    "modal"
  );


if(modal){

  modal.addEventListener(
    "click",
    function(e){

      if(e.target === this){

        closeModal();

      }

    }
  );

}


/* =========================
   SCROLL
========================= */

function scrollToModels(){

  const modelsSection =
    document.getElementById(
      "models"
    );


  if(modelsSection){

    modelsSection.scrollIntoView({
      behavior:"smooth"
    });

  }

}

/* =========================
   MARKETPLACE3D APP
========================= */


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


    card.className =
      "modelCard";


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
          onclick="event.stopPropagation(); openDesigner('${model.creator}')"
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


    card.addEventListener(
      "click",
      () => {

        document.getElementById(
          "modalContent"
        ).innerHTML = `

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
            <b>${model.creator}</b>
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


        document
          .getElementById("modal")
          .classList.remove("hidden");

      }
    );


    grid.appendChild(card);

  });

}


displayModels(models);


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


      displayModels(
        filtered
      );

    }
  );

}


/* =========================
   DESIGNER PORTFOLIO
========================= */

function openDesigner(
  creator
){

  if(!creator) return;


  window.location.href =
    "/portfolio.html?username=" +
    encodeURIComponent(
      creator
    );

}


/* =========================
   LOGIN
========================= */

function login(){

  document.getElementById(
    "modalContent"
  ).innerHTML = `

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
        box-sizing:border-box;
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
        box-sizing:border-box;
      "
    >


    <button
      id="loginSubmit"
      class="uploadBtn"
      style="margin-top:10px"
    >
      Login
    </button>


    <p
      id="loginError"
      style="
        color:#d33;
        margin-top:10px;
      "
    ></p>

  `;


  document
    .getElementById("modal")
    .classList.remove(
      "hidden"
    );


  document
    .getElementById("loginSubmit")
    .onclick =
    submitLogin;

}


async function submitLogin(){

  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "loginPassword"
    ).value;


  const error =
    document.getElementById(
      "loginError"
    );


  if(!email || !password){

    error.textContent =
      "Please enter your email and password.";

    return;

  }


  try{

    const response =
      await fetch(
        "/api/login",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            email,
            password
          })
        }
      );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(
        data.error ||
        "Login failed."
      );

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


    updateAuthUI();


    closeModal();


  }catch(err){

    error.textContent =
      err.message;

  }

}
/* =========================
   SIGN UP
========================= */

function signup(){

  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <h2>
      Create an account
    </h2>


    <p style="color:#777">
      Join Marketplace3D and start
      sharing your designs.
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
        box-sizing:border-box;
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
        box-sizing:border-box;
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
        box-sizing:border-box;
      "
    >


    <button
      id="signupSubmit"
      class="uploadBtn"
      style="margin-top:10px"
    >
      Create Account
    </button>


    <p
      id="signupError"
      style="
        color:#d33;
        margin-top:10px;
      "
    ></p>

  `;


  document
    .getElementById("modal")
    .classList.remove(
      "hidden"
    );


  document
    .getElementById("signupSubmit")
    .onclick =
    submitSignup;

}


async function submitSignup(){

  const name =
    document.getElementById(
      "signupName"
    ).value.trim();


  const email =
    document.getElementById(
      "signupEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "signupPassword"
    ).value;


  const error =
    document.getElementById(
      "signupError"
    );


  if(
    !name ||
    !email ||
    !password
  ){

    error.textContent =
      "Please complete all fields.";

    return;

  }


  if(password.length < 6){

    error.textContent =
      "Password must contain at least 6 characters.";

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

          body:JSON.stringify({
            name,
            email,
            password
          })
        }
      );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(
        data.error ||
        "Registration failed."
      );

    }


    /*
      SAVE LOGIN
    */

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


    /*
      UPDATE PROFILE BUTTON
    */

    updateAuthUI();


    /*
      CLOSE MODAL
    */

    closeModal();


  }catch(err){

    error.textContent =
      err.message;

  }

}


/* =========================
   AUTH UI
========================= */

function updateAuthUI(){

  const token =
    localStorage.getItem(
      "token"
    );


  const userString =
    localStorage.getItem(
      "user"
    );


  let user = null;


  try{

    user =
      userString
        ? JSON.parse(
            userString
          )
        : null;

  }catch{

    user = null;

  }


  /*
    USERNAME FOR PORTFOLIO
  */

  const portfolioUsername =
    user?.profile?.username ||
    user?.username ||
    user?.name ||
    "";


  /*
    TOP LOGIN
  */

  const loginTop =
    document.getElementById(
      "loginTop"
    );


  if(loginTop){

    if(
      token &&
      user &&
      portfolioUsername
    ){

      loginTop.textContent =
        user.name ||
        portfolioUsername;


      loginTop.onclick =
        () => {

          window.location.href =
            "/portfolio.html?username=" +
            encodeURIComponent(
              portfolioUsername
            );

        };

    }else{

      loginTop.textContent =
        "Login";


      loginTop.onclick =
        login;

    }

  }


  /*
    SIDEBAR LOGIN
  */

  const loginBtn =
    document.getElementById(
      "loginBtn"
    );


  if(loginBtn){

    if(
      token &&
      user &&
      portfolioUsername
    ){

      loginBtn.textContent =
        user.name ||
        portfolioUsername;


      loginBtn.onclick =
        () => {

          window.location.href =
            "/portfolio.html?username=" +
            encodeURIComponent(
              portfolioUsername
            );

        };

    }else{

      loginBtn.textContent =
        "Login";


      loginBtn.onclick =
        login;

    }

  }


  /*
    SIGN UP
  */

  const signupTop =
    document.getElementById(
      "signupTop"
    );


  if(signupTop){

    if(
      token &&
      user
    ){

      signupTop.style.display =
        "none";

    }else{

      signupTop.style.display =
        "";

      signupTop.onclick =
        signup;

    }

  }


  /*
    NEW PROFILE BUTTON
  */

  const profileTop =
    document.getElementById(
      "profileTop"
    );


  if(profileTop){

    if(
      token &&
      user &&
      portfolioUsername
    ){

      profileTop.textContent =
        user.name ||
        portfolioUsername;


      profileTop.style.display =
        "inline-flex";


      profileTop.style.cursor =
        "pointer";


      profileTop.onclick =
        () => {

          window.location.href =
            "/portfolio.html?username=" +
            encodeURIComponent(
              portfolioUsername
            );

        };

    }else{

      profileTop.style.display =
        "none";

    }

  }

}
/* =========================
   UPLOAD
========================= */

function openUpload(){

  const token =
    localStorage.getItem(
      "token"
    );


  if(!token){

    login();

    return;

  }


  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <h2>
      Upload a 3D Model
    </h2>


    <p style="color:#777">
      Upload your STL, 3MF or OBJ file.
    </p>


    <input
      id="modelTitle"
      type="text"
      placeholder="Model name"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
        box-sizing:border-box;
      "
    >


    <textarea
      id="modelDescription"
      placeholder="Description"
      style="
        width:100%;
        min-height:100px;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
        box-sizing:border-box;
        resize:vertical;
      "
    ></textarea>


    <select
      id="modelCategory"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
        box-sizing:border-box;
      "
    >

      <option value="home">
        Home & Decor
      </option>

      <option value="carparts">
        Car Parts
      </option>

      <option value="toys">
        Toys & Games
      </option>

      <option value="tools">
        Tools
      </option>

      <option value="diy">
        Leisure & DIY
      </option>

      <option value="printer">
        3D Printer
      </option>

      <option value="art">
        Art
      </option>

      <option value="miniatures">
        Miniatures
      </option>

    </select>


    <input
      id="modelPrice"
      type="number"
      min="0"
      step="0.01"
      placeholder="Price (0 = Free)"
      style="
        width:100%;
        padding:12px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
        box-sizing:border-box;
      "
    >


    <label
      style="
        display:block;
        margin:12px 0 5px;
        font-weight:600;
      "
    >
      3D Model
    </label>


    <input
      id="modelFile"
      type="file"
      accept=".stl,.3mf,.obj,.zip"
      style="
        width:100%;
        padding:8px 0;
      "
    >


    <label
      style="
        display:block;
        margin:12px 0 5px;
        font-weight:600;
      "
    >
      Preview Image
    </label>


    <input
      id="modelImage"
      type="file"
      accept=".png,.jpg,.jpeg,.webp"
      style="
        width:100%;
        padding:8px 0;
      "
    >


    <button
      id="uploadSubmit"
      class="uploadBtn"
      style="margin-top:15px"
    >
      Upload Model
    </button>


    <p
      id="uploadError"
      style="
        color:#d33;
        margin-top:10px;
      "
    ></p>

  `;


  document
    .getElementById("modal")
    .classList.remove(
      "hidden"
    );


  document
    .getElementById("uploadSubmit")
    .onclick =
    submitUpload;

}


/* =========================
   SUBMIT UPLOAD
========================= */

async function submitUpload(){

  const token =
    localStorage.getItem(
      "token"
    );


  const title =
    document.getElementById(
      "modelTitle"
    ).value.trim();


  const description =
    document.getElementById(
      "modelDescription"
    ).value.trim();


  const category =
    document.getElementById(
      "modelCategory"
    ).value;


  const price =
    document.getElementById(
      "modelPrice"
    ).value;


  const modelFile =
    document.getElementById(
      "modelFile"
    ).files[0];


  const imageFile =
    document.getElementById(
      "modelImage"
    ).files[0];


  const error =
    document.getElementById(
      "uploadError"
    );


  if(!title){

    error.textContent =
      "Please enter a model name.";

    return;

  }


  if(!modelFile){

    error.textContent =
      "Please select a 3D model file.";

    return;

  }


  const formData =
    new FormData();


  formData.append(
    "title",
    title
  );


  formData.append(
    "description",
    description
  );


  formData.append(
    "category",
    category
  );


  formData.append(
    "price",
    price || "0"
  );


  formData.append(
    "modelFile",
    modelFile
  );


  if(imageFile){

    formData.append(
      "image",
      imageFile
    );

  }


  try{

    const response =
      await fetch(
        "/api/models",
        {
          method:"POST",

          headers:{
            Authorization:
              "Bearer " + token
          },

          body:formData
        }
      );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(
        data.error ||
        "Upload failed."
      );

    }


    closeModal();


    /*
      Reload models
    */

    loadModelsFromServer();


  }catch(err){

    error.textContent =
      err.message;

  }

}


/* =========================
   LOAD MODELS FROM SERVER
========================= */

async function loadModelsFromServer(){

  try{

    const response =
      await fetch(
        "/api/models"
      );


    if(!response.ok){

      return;

    }


    const serverModels =
      await response.json();


    if(
      Array.isArray(
        serverModels
      ) &&
      serverModels.length
    ){

      const converted =
        serverModels.map(
          model => ({

            id:model.id,

            title:
              model.title,

            creator:
              model.designerName ||
              "Designer",

            category:
              model.category,

            price:
              model.price > 0
                ? "$" +
                  Number(
                    model.price
                  ).toFixed(2)
                : "Free",

            stats:
              "0 ♥",

            image:
              model.imageUrl ||
              "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=85"

          })
        );


      displayModels(
        converted
      );

    }


  }catch(error){

    console.error(
      "Could not load server models:",
      error
    );

  }

}


/* =========================
   MODAL CLOSE
========================= */

function closeModal(){

  const modal =
    document.getElementById(
      "modal"
    );


  if(modal){

    modal.classList.add(
      "hidden"
    );

  }

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


/* =========================
   AUTH BUTTONS
========================= */

const signupTop =
  document.getElementById(
    "signupTop"
  );


if(signupTop){

  signupTop.onclick =
    signup;

}


const loginTop =
  document.getElementById(
    "loginTop"
  );


if(loginTop){

  loginTop.onclick =
    login;

}


/* =========================
   INITIAL AUTH UI
========================= */

updateAuthUI();


/* =========================
   LOAD SERVER MODELS
========================= */

loadModelsFromServer();

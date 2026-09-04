const models = [

  {
    name: "Modern Vase",
    creator: "Studio 3D",
    price: "Free",
    icon: "🏺"
  },

  {
    name: "Cable Organizer",
    creator: "MakerLab",
    price: "$2.99",
    icon: "⚙️"
  },

  {
    name: "Mini Car",
    creator: "3D Garage",
    price: "$4.50",
    icon: "🚗"
  },

  {
    name: "Desk Planter",
    creator: "PrintCraft",
    price: "Free",
    icon: "🪴"
  },

  {
    name: "Robot Figure",
    creator: "Pixel Maker",
    price: "$3.00",
    icon: "🤖"
  },

  {
    name: "Phone Stand",
    creator: "Design Hub",
    price: "$1.99",
    icon: "📱"
  }

];


function renderModels(list = models) {

  const grid = document.getElementById("grid");

  grid.innerHTML = list.map(model => {

    return `

      <article class="card">

        <div class="thumb">
          ${model.icon}
        </div>

        <div class="cardBody">

          <h3>
            ${model.name}
          </h3>

          <div class="muted">
            by ${model.creator}
          </div>

          <div class="price">
            ${model.price}
          </div>

        </div>

      </article>

    `;

  }).join("");

}


function openUpload() {

  document.getElementById("modalContent").innerHTML = `

    <h2>Upload a 3D Model</h2>

    <p>
      Upload your STL, 3MF or OBJ file.
    </p>

    <input
      type="file"
      accept=".stl,.3mf,.obj"
    >

    <br><br>

    <button
      class="primaryBtn"
      onclick="closeModal()"
    >
      Continue
    </button>

  `;

  document
    .getElementById("modal")
    .classList
    .remove("hidden");

}


function closeModal() {

  document
    .getElementById("modal")
    .classList
    .add("hidden");

}


document.addEventListener(
  "DOMContentLoaded",
  function () {

    renderModels();


    /* SEARCH */

    const search =
      document.getElementById("search");


    search.addEventListener(
      "input",
      function () {

        const query =
          this.value
            .toLowerCase()
            .trim();


        if (!query) {

          renderModels();

          return;

        }


        const filtered =
          models.filter(model => {

            return (
              model.name
                .toLowerCase()
                .includes(query)
              ||
              model.creator
                .toLowerCase()
                .includes(query)
            );

          });


        renderModels(filtered);

      }
    );


    /* LOGIN */

    document
      .getElementById("loginBtn")
      .addEventListener(
        "click",
        function () {

          document
            .getElementById("modalContent")
            .innerHTML = `

              <h2>Login</h2>

              <input
                type="email"
                placeholder="Email"
              >

              <input
                type="password"
                placeholder="Password"
              >

              <br><br>

              <button
                class="primaryBtn"
                onclick="closeModal()"
              >
                Login
              </button>

            `;


          document
            .getElementById("modal")
            .classList
            .remove("hidden");

        }
      );


    /* MODEL TABS */

    const tabs =
      document.querySelectorAll(
        ".modelTabs button"
      );


    tabs.forEach(button => {

      button.addEventListener(
        "click",
        function () {

          tabs.forEach(btn => {
            btn.classList.remove("active");
          });

          this.classList.add("active");

        }
      );

    });

  }
);

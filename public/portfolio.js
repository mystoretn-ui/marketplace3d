/* ================================
   PORTFOLIO
================================ */

function escapeHtml(s) {

  return String(s || "")
    .replace(/[&<>"']/g, c => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[c]));

}


/* ================================
   GET USERNAME FROM URL
================================ */

const params =
  new URLSearchParams(
    window.location.search
  );

const username =
  params.get("username");


/* ================================
   LOAD PORTFOLIO
================================ */

async function loadPortfolio() {

  if (!username) {

    showError(
      "Designer not specified."
    );

    return;

  }


  try {

    const response =
      await fetch(
        "/api/designers/" +
        encodeURIComponent(username)
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Designer not found."
      );

    }


    renderPortfolio(data);


  } catch(error) {

    showError(
      error.message
    );

  }

}


/* ================================
   RENDER
================================ */

function renderPortfolio(data) {

  const profile =
    data.profile || {};

  const stats =
    data.stats || {};

  const models =
    data.models || [];


  /* NAME */

  document
    .getElementById(
      "designerName"
    )
    .textContent =
      data.name || "Designer";


  /* USERNAME */

  document
    .getElementById(
      "designerUsername"
    )
    .textContent =
      "@" +
      (
        profile.username ||
        username
      );


  /* BIO */

  document
    .getElementById(
      "designerBio"
    )
    .textContent =
      profile.bio ||
      "3D designer and creator.";


  /* STATS */

  document
    .getElementById(
      "modelCount"
    )
    .textContent =
      stats.models || 0;


  document
    .getElementById(
      "downloadCount"
    )
    .textContent =
      stats.downloads || 0;


  /* AVATAR */

  const avatar =
    document.getElementById(
      "avatar"
    );


  if (profile.avatarUrl) {

    avatar.innerHTML =
      `<img src="${escapeHtml(
        profile.avatarUrl
      )}" alt="">`;

  } else {

    const initials =
      String(
        data.name || "3D"
      )
        .trim()
        .split(/\s+/)
        .map(
          word =>
            word[0]
        )
        .join("")
        .slice(0, 2)
        .toUpperCase();


    avatar.textContent =
      initials || "3D";

  }


  /* MODELS */

  renderModels(models);

}


/* ================================
   MODELS
================================ */

function renderModels(models) {

  const grid =
    document.getElementById(
      "modelGrid"
    );


  if (!models.length) {

    grid.innerHTML = `
      <p class="loading">
        This designer hasn't published any models yet.
      </p>
    `;

    return;

  }


  grid.innerHTML =
    models.map(model => `

      <article
        class="card"
        onclick="openModel('${model.id}')"
      >

        <div class="thumb">

          ${
            model.imageUrl

            ? `
              <img
                src="${escapeHtml(
                  model.imageUrl
                )}"
                alt="${escapeHtml(
                  model.title
                )}"
              >
            `

            : "3D MODEL"
          }

        </div>


        <div class="cardBody">

          <h3>
            ${escapeHtml(
              model.title
            )}
          </h3>


          <div class="muted">

            ${escapeHtml(
              model.category
            )}

          </div>


          <div class="price">

            ${
              model.price > 0

              ? model.price.toFixed(2) +
                " $"

              : "Free"
            }

          </div>

        </div>

      </article>

    `).join("");

}


/* ================================
   OPEN MODEL
================================ */

function openModel(id) {

  window.location.href =
    "/?model=" +
    encodeURIComponent(id);

}


/* ================================
   ERROR
================================ */

function showError(message) {

  document.getElementById(
    "designerName"
  ).textContent =
    "Designer not found";


  document.getElementById(
    "designerUsername"
  ).textContent =
    "";


  document.getElementById(
    "designerBio"
  ).textContent =
    message;


  document.getElementById(
    "modelGrid"
  ).innerHTML = "";

}


/* ================================
   LOGIN
================================ */

const loginBtn =
  document.getElementById(
    "loginBtn"
  );


if (loginBtn) {

  loginBtn.onclick = () => {

    window.location.href =
      "/";

  };

}


/* ================================
   START
================================ */

loadPortfolio();

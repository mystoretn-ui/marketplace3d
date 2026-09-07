async function api(url, options = {}) {
  const r = await fetch(url, options);

  let d = {};

  try {
    d = await r.json();
  } catch (e) {
    // Response may not contain JSON
  }

  if (!r.ok) {
    throw new Error(d.error || "Erreur");
  }

  return d;
}

const grid = document.getElementById("modelGrid");
const search = document.getElementById("searchInput");
const authLink = document.getElementById("authLink");
const mobileMenu = document.getElementById("mobileMenu");

let state = {
  category: "",
  q: ""
};

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m])
  );
}

function card(m) {
  return `
    <article class="model-card">
      <a href="/model.html?id=${encodeURIComponent(m.id)}">
        <div class="thumb">
          <img src="${m.thumbnail || "/images/models/ghost.svg"}" alt="">
          <span class="badge">${esc(m.category || "3D")}</span>
        </div>

        <div class="model-body">
          <div class="model-title">${esc(m.title)}</div>

          <a
            class="creator"
            href="/profile.html?username=${encodeURIComponent(
              m.creator.username
            )}"
            onclick="event.stopPropagation();"
          >
            @${esc(m.creator.username)}
          </a>

          <div class="model-meta">
            <span>
              ♥ ${m.likes || 0} · ↓ ${m.downloads || 0}
            </span>

            <span class="price">
              ${
                Number(m.price) > 0
                  ? "$" + Number(m.price).toFixed(2)
                  : "FREE"
              }
            </span>
          </div>
        </div>
      </a>
    </article>
  `;
}

async function load() {
  if (!grid) return;

  try {
    const d = await api(
      `/api/models?category=${encodeURIComponent(
        state.category
      )}&q=${encodeURIComponent(state.q)}`
    );

    if (d.models && d.models.length) {
      grid.innerHTML = d.models.map(card).join("");
    } else {
      grid.innerHTML =
        `<div class="loading">Aucun modèle trouvé.</div>`;
    }
  } catch (e) {
    grid.innerHTML =
      `<div class="loading">${esc(e.message)}</div>`;
  }
}

async function init() {

  // Default state: user is NOT logged in
  if (authLink) {
    authLink.textContent = "S'identifier";
    authLink.href = "/login.html";
  }

  try {
    const me = await api("/api/me");

    // User is logged in
    if (me && me.user) {

      if (authLink) {
        authLink.textContent = "@" + me.user.username;
        authLink.href =
          "/profile.html?username=" +
          encodeURIComponent(me.user.username);
      }

      const registerLink =
        document.getElementById("registerLink");

      if (registerLink) {
        registerLink.style.display = "none";
      }

    } else {

      // User is NOT logged in
      if (authLink) {
        authLink.textContent = "S'identifier";
        authLink.href = "/login.html";
      }
    }

  } catch (e) {

    // If /api/me fails, keep Login working
    if (authLink) {
      authLink.textContent = "S'identifier";
      authLink.href = "/login.html";
    }
  }

  load();
}


// Categories
document.querySelectorAll(".pill").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".pill")
      .forEach(x => x.classList.remove("active"));

    button.classList.add("active");

    state.category =
      button.dataset.category || "";

    load();
  });

});


// Search
let timer;

if (search) {

  search.addEventListener("input", () => {

    clearTimeout(timer);

    timer = setTimeout(() => {

      state.q = search.value.trim();

      load();

    }, 250);

  });

}


// Mobile menu
if (mobileMenu) {

  mobileMenu.addEventListener("click", () => {

    const sidebar =
      document.getElementById("sidebar");

    if (sidebar) {
      sidebar.classList.toggle("open");
    }

  });

}


// Start application
init();

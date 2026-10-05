// ---------- Settings ----------
const API = "https://pokeapi.co/api/v2/pokemon";
const PAGE_SIZE = 20;

// ---------- State ----------
let offset = 0;
let total = 0;
let pokemonList = []; // details for the current page

// ---------- Elements ----------
const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("search");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageInfo = document.getElementById("page-info");

// ---------- Helpers ----------
function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status " + type;
}

// Turn the raw API response into just what we need
function simplify(data) {
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
    height: data.height / 10, // decimetres -> metres
    weight: data.weight / 10, // hectograms -> kilograms
  };
}

// ---------- Fetching ----------
async function loadPage() {
  setStatus("Loading Pokémon…", "loading");
  grid.innerHTML = "";
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  try {
    // 1. Get the list of names + URLs
    const listRes = await fetch(`${API}?limit=${PAGE_SIZE}&offset=${offset}`);
    if (!listRes.ok) throw new Error("List request failed");
    const listData = await listRes.json();
    total = listData.count;

    // 2. Fetch every Pokémon's details at the same time
    const details = await Promise.all(
      listData.results.map(async (p) => {
        const res = await fetch(p.url);
        if (!res.ok) throw new Error(`Failed to load ${p.name}`);
        return res.json();
      })
    );

    pokemonList = details.map(simplify);
    setStatus("");
    render();
  } catch (err) {
    console.error(err);
    setStatus("Could not load Pokémon. Check your connection and try again.", "error");
  }

  updatePagination();
}

// ---------- Rendering ----------
function createCard(pokemon, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.type = pokemon.types[0];
  card.style.animationDelay = `${index * 30}ms`;

  const id = document.createElement("span");
  id.className = "card-id";
  id.textContent = "#" + String(pokemon.id).padStart(3, "0");

  const img = document.createElement("img");
  img.src = pokemon.image;
  img.alt = pokemon.name;
  img.loading = "lazy";

  const name = document.createElement("h2");
  name.textContent = pokemon.name;

  const types = document.createElement("div");
  types.className = "types";
  pokemon.types.forEach((type) => {
    const badge = document.createElement("span");
    badge.className = "type-badge";
    badge.dataset.type = type;
    badge.textContent = type;
    types.appendChild(badge);
  });

  const stats = document.createElement("p");
  stats.className = "stats";
  stats.textContent = `${pokemon.height} m · ${pokemon.weight} kg`;

  const speech = document.createElement("p");
  speech.className = "speech";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Say hi!";
  button.addEventListener("click", () => {
    const ability = pokemon.abilities[0];
    speech.textContent = `I am ${pokemon.name} and I have ${ability}.`;
    speech.classList.toggle("show");
    button.textContent = speech.classList.contains("show") ? "Hide" : "Say hi!";
  });

  card.append(id, img, name, types, stats, button, speech);
  return card;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = pokemonList.filter((p) => p.name.includes(query));

  grid.innerHTML = "";
  filtered.forEach((p, i) => grid.appendChild(createCard(p, i)));

  if (pokemonList.length && filtered.length === 0) {
    setStatus(`No Pokémon on this page match "${searchInput.value.trim()}".`);
  } else if (!statusEl.classList.contains("error")) {
    setStatus("");
  }
}

// ---------- Pagination ----------
function updatePagination() {
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  pageInfo.textContent = total ? `Page ${page} of ${pages}` : "";
  prevBtn.disabled = offset === 0;
  nextBtn.disabled = total === 0 || offset + PAGE_SIZE >= total;
}

prevBtn.addEventListener("click", () => {
  offset = Math.max(0, offset - PAGE_SIZE);
  searchInput.value = "";
  loadPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

nextBtn.addEventListener("click", () => {
  offset += PAGE_SIZE;
  searchInput.value = "";
  loadPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Search (filters loaded data, no API calls) ----------
searchInput.addEventListener("input", render);

// ---------- Start ----------
loadPage();
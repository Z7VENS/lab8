import { getShowData, getEpisodeList, searchShows } from "./services/tvmaze.js";

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $input = document.querySelector("#search-input");


const createEpisodeHTML = (episode) => {
  const r = episode.rating ? Math.round(episode.rating) : 0;
  return `<div class="episode episode-${episode.number} rating-${r}">${episode.number}</div>`;
};

const createSeasonHTML = (data, number) => {
  const episodesHTML = data.map(createEpisodeHTML).join("");
  return `
    <article class="season">
      <header class="season-header">T${number}</header>
      ${episodesHTML}
    </article>
  `;
};


const load = async (id) => {
  const show = await getShowData(id);
  const seasons = await getEpisodeList(id);

  $header.setHTMLUnsafe(`
    <img class="poster" src="${show.image}">
    <h1>${show.name} (Nota: ${show.rating})</h1>
  `);

  const list = Object.entries(seasons).map(([num, eps]) => createSeasonHTML(eps, num));
  $episodes.setHTMLUnsafe(list.join(""));
};


const $suggestions = document.createElement("div");
$suggestions.classList.add("suggestions");
$input.parentElement.appendChild($suggestions);

$input.addEventListener("input", async () => {
  const query = $input.value.trim();
  if (query.length < 2) { $suggestions.style.display = "none"; return; }

  const results = await searchShows(query);
  $suggestions.innerHTML = results.map(i => `
    <div class="suggestion-item" data-id="${i.show.id}">
      <span>${i.show.name}</span>
    </div>
  `).join("");
  $suggestions.style.display = "block";
});

$suggestions.addEventListener("click", (e) => {
  const el = e.target.closest(".suggestion-item");
  if (el) {
    load(el.dataset.id);
    $suggestions.style.display = "none";
    $input.value = "";
  }
});

load("2993");
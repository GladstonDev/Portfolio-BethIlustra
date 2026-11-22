import { artworks } from "./data/artworks.js";

const grid = document.getElementById("gallery-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const closeBtn = document.getElementById("close-lightbox");

function renderGallery(filter = "all") {
  grid.innerHTML = "";

  const filtered = filter === "all"
    ? artworks
    : artworks.filter((art) => art.category === filter);

  filtered.forEach((art) => {
    const card = document.createElement("article");
    card.className = "art-card";
    card.innerHTML = `
      <img src="${art.thumb}" alt="${art.title}" loading="lazy" />
      <div class="art-overlay">
        <span>${art.title}</span>
      </div>
    `;

    card.addEventListener("click", () => openLightbox(art));
    grid.appendChild(card);
  });
}

function openLightbox(art) {
  document.getElementById("lightbox-img").src = art.full;
  document.getElementById("lightbox-img").alt = art.title;
  document.getElementById("lightbox-title").textContent = art.title;
  document.getElementById("lightbox-meta").textContent = `${art.medium} • ${art.year}`;
  document.getElementById("lightbox-desc").textContent = art.description;
  lightbox.showModal();
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderGallery(btn.dataset.filter);
  });
});

closeBtn.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

renderGallery();
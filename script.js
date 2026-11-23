import { artworks } from "./data/artworks.js";
import { feedbacks } from "./data/feedbacks.js";

const grid = document.getElementById("gallery-grid");
const feedbacksGrid = document.getElementById("feedbacks-grid");
const filterBtns = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const closeBtn = document.getElementById("close-lightbox");
const prevBtn = document.getElementById("prev-lightbox");
const nextBtn = document.getElementById("next-lightbox");

const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxMeta = document.getElementById("lightbox-meta");
const lightboxDesc = document.getElementById("lightbox-desc");
const lightboxCounter = document.getElementById("lightbox-counter");

let currentItems = [];
let currentIndex = 0;

function formatNumber(index, total) {
  const padLength = Math.max(2, String(total).length);
  return String(index + 1).padStart(padLength, "0");
}

function renderGallery(filter = "all") {
  grid.innerHTML = "";

  const filtered = filter === "all"
    ? artworks
    : artworks.filter((art) => art.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="empty-state">Nenhuma ilustração encontrada nesta categoria no momento.</p>`;
    return;
  }

  filtered.forEach((art, index) => {
    const numLabel = formatNumber(index, filtered.length);
    const card = document.createElement("article");
    card.className = "art-card";
    card.innerHTML = `
      <span class="card-index">${numLabel}</span>
      <img src="${art.thumb}" alt="${art.title}" loading="lazy" />
      <div class="art-overlay">
        <span>${art.title}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      openLightbox(
        filtered.map((item, idx) => ({
          src: item.full,
          alt: item.title,
          title: item.title,
          meta: `${item.medium} • ${item.year}`,
          description: item.description,
          number: formatNumber(idx, filtered.length),
          total: formatNumber(filtered.length - 1, filtered.length)
        })),
        index
      );
    });

    grid.appendChild(card);
  });
}

function renderFeedbacks() {
  if (!feedbacksGrid) return;
  feedbacksGrid.innerHTML = "";

  const visualFeedbacks = feedbacks.filter((item) => Boolean(item.image));

  feedbacks.forEach((fb) => {
    const card = document.createElement("article");
    card.className = "feedback-card";

    card.innerHTML = `
      ${fb.image ? `<img src="${fb.image}" alt="Feedback de ${fb.author}" class="feedback-img" loading="lazy" />` : ""}
      <blockquote class="feedback-quote">“${fb.quote}”</blockquote>
      <div class="feedback-author">
        <strong>${fb.author}</strong>
        ${fb.project ? `<span>${fb.project}</span>` : ""}
      </div>
    `;

    if (fb.image) {
      card.classList.add("is-clickable");
      const imgIndex = visualFeedbacks.findIndex((item) => item.id === fb.id);
      card.addEventListener("click", () => {
        openLightbox(
          visualFeedbacks.map((item, idx) => ({
            src: item.image,
            alt: `Feedback de ${item.author}`,
            title: item.author,
            meta: item.project || "Feedback de cliente",
            description: item.quote,
            number: formatNumber(idx, visualFeedbacks.length),
            total: formatNumber(visualFeedbacks.length - 1, visualFeedbacks.length)
          })),
          imgIndex
        );
      });
    }

    feedbacksGrid.appendChild(card);
  });
}

function updateLightboxContent() {
  const item = currentItems[currentIndex];
  if (!item) return;

  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxTitle.textContent = item.title;
  lightboxMeta.textContent = item.meta;
  lightboxDesc.textContent = item.description;
  lightboxCounter.textContent = `${item.number} / ${item.total}`;

  const hasMultiple = currentItems.length > 1;
  prevBtn.style.display = hasMultiple ? "grid" : "none";
  nextBtn.style.display = hasMultiple ? "grid" : "none";
}

function openLightbox(items, index = 0) {
  currentItems = items;
  currentIndex = index;
  updateLightboxContent();

  if (!lightbox.open) {
    lightbox.showModal();
  }
}

function showPrev() {
  if (currentItems.length <= 1) return;
  currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
  updateLightboxContent();
}

function showNext() {
  if (currentItems.length <= 1) return;
  currentIndex = (currentIndex + 1) % currentItems.length;
  updateLightboxContent();
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderGallery(btn.dataset.filter);
  });
});

prevBtn.addEventListener("click", showPrev);
nextBtn.addEventListener("click", showNext);
closeBtn.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showPrev();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    showNext();
  }
});

renderGallery();
renderFeedbacks();
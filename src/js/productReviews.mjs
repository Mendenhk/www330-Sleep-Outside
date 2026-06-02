import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// Storage key is scoped per product so reviews don't bleed across products
const STORAGE_KEY_PREFIX = "so-reviews-";

export default class ProductReviews {
  constructor(productId) {
    this.productId = productId;
    this.storageKey = `${STORAGE_KEY_PREFIX}${productId}`;
    this.selectedRating = 0;
  }

  init() {
    this.renderSummary();
    this.renderReviews();
    this.setupStarInput();
    this.setupCharCount();
    this.setupSubmit();
  }

  // ── Read / Write ──────────────────────────────────────────────────────

  getReviews() {
    return getLocalStorage(this.storageKey) || [];
  }

  saveReview(review) {
    const reviews = this.getReviews();
    reviews.unshift(review); // newest first
    setLocalStorage(this.storageKey, reviews);
  }

  // ── Render ────────────────────────────────────────────────────────────

  renderSummary() {
    const reviews = this.getReviews();
    const container = document.getElementById("reviewsSummary");
    if (!container) return;

    if (reviews.length === 0) {
      container.innerHTML = `<p class="no-reviews-msg">No reviews yet. Be the first!</p>`;
      return;
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const rounded = Math.round(avg * 10) / 10;

    container.innerHTML = `
      <div class="summary-score">
        <span class="summary-avg">${rounded.toFixed(1)}</span>
        <div class="summary-stars">${this.starsHTML(avg)}</div>
        <span class="summary-count">${reviews.length} review${reviews.length !== 1 ? "s" : ""}</span>
      </div>
    `;
  }

  renderReviews() {
    const reviews = this.getReviews();
    const container = document.getElementById("reviewsList");
    if (!container) return;

    if (reviews.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = reviews
      .map(
        (review) => `
      <div class="review-card">
        <div class="review-card__header">
          <span class="reviewer-name">${this.escapeHTML(review.name)}</span>
          <span class="review-stars">${this.starsHTML(review.rating)}</span>
          <span class="review-date">${review.date}</span>
        </div>
        <p class="review-body">${this.escapeHTML(review.comment)}</p>
      </div>
    `
      )
      .join("");
  }

  // ── Star Input ────────────────────────────────────────────────────────

  setupStarInput() {
    const starBtns = document.querySelectorAll(".star-btn");
    const ratingLabel = document.getElementById("ratingLabel");

    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    starBtns.forEach((btn) => {
      // Hover: highlight up to hovered star
      btn.addEventListener("mouseenter", () => {
        const val = parseInt(btn.dataset.value);
        this.highlightStars(val);
      });

      // Mouse leaves the whole group: go back to selected state
      btn.addEventListener("mouseleave", () => {
        this.highlightStars(this.selectedRating);
      });

      // Click: lock in the rating
      btn.addEventListener("click", () => {
        this.selectedRating = parseInt(btn.dataset.value);
        this.highlightStars(this.selectedRating);
        ratingLabel.textContent = labels[this.selectedRating];
        ratingLabel.style.color = "var(--secondary-color)";
      });
    });
  }

  highlightStars(count) {
    document.querySelectorAll(".star-btn").forEach((btn) => {
      const val = parseInt(btn.dataset.value);
      btn.classList.toggle("active", val <= count);
    });
  }

  // ── Character counter ─────────────────────────────────────────────────

  setupCharCount() {
    const textarea = document.getElementById("reviewComment");
    const counter = document.getElementById("charCount");
    if (!textarea || !counter) return;

    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length} / 500`;
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────

  setupSubmit() {
    const btn = document.getElementById("submitReview");
    if (!btn) return;
    btn.addEventListener("click", this.handleSubmit.bind(this));
  }

  handleSubmit() {
    const nameInput = document.getElementById("reviewerName");
    const commentInput = document.getElementById("reviewComment");
    const errorEl = document.getElementById("reviewError");

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();
    const rating = this.selectedRating;

    // Validation
    errorEl.textContent = "";
    if (!name) {
      errorEl.textContent = "Please enter your name.";
      nameInput.focus();
      return;
    }
    if (rating === 0) {
      errorEl.textContent = "Please select a star rating.";
      return;
    }
    if (!comment) {
      errorEl.textContent = "Please write a review comment.";
      commentInput.focus();
      return;
    }

    const review = {
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    this.saveReview(review);

    // Reset form
    nameInput.value = "";
    commentInput.value = "";
    this.selectedRating = 0;
    this.highlightStars(0);
    document.getElementById("ratingLabel").textContent = "Select a rating";
    document.getElementById("ratingLabel").style.color = "";
    document.getElementById("charCount").textContent = "0 / 500";

    // Re-render the list and summary
    this.renderReviews();
    this.renderSummary();

    // Scroll the new review into view
    document
      .getElementById("reviewsList")
      .firstElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  // Renders filled/half/empty stars from a numeric rating
  starsHTML(rating) {
    return Array.from({ length: 5 }, (_, i) => {
      const full = i + 1 <= Math.floor(rating);
      const half = !full && i < rating;
      const cls = full ? "star filled" : half ? "star half" : "star empty";
      return `<span class="${cls}">&#9733;</span>`;
    }).join("");
  }

  // Prevent XSS from user-submitted content
  escapeHTML(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (m) => map[m]);
  }
}

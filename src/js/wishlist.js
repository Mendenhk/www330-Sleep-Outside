import { loadHeaderFooter } from "./utils.mjs";

import { getWishlist, removeFromWishlist } from "./wishlist.mjs";

import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

loadHeaderFooter();

function renderWishlistContents() {
  const wishlist = getWishlist();

  const list = document.getElementById("wishlist-list");

  if (!wishlist || wishlist.length === 0) {
    list.innerHTML = `
      <li class="divider">
        <p>Your wishlist is empty.</p>
      </li>
    `;
    return;
  }

  list.innerHTML = wishlist.map((item) => wishlistItemTemplate(item)).join("");

  // Move to Cart buttons
  document.querySelectorAll(".moveToCart").forEach((button) => {
    button.addEventListener("click", () => {
      moveToCart(button.dataset.id);
    });
  });

  // Remove buttons
  document.querySelectorAll(".removeWishlist").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromWishlist(button.dataset.id);
      renderWishlistContents();
    });
  });
}

function moveToCart(id) {
  const wishlistItems = getWishlist();
  const cartItems = getLocalStorage("so-cart") || [];

  const product = wishlistItems.find((item) => item.Id === id);

  if (!product) return;

  const existingCartItem = cartItems.find((item) => item.Id === id);

  if (existingCartItem) {
    existingCartItem.quantity = (existingCartItem.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cartItems.push(product);
  }

  setLocalStorage("so-cart", cartItems);

  removeFromWishlist(id);

  updateCartCount();

  renderWishlistContents();
}

function wishlistItemTemplate(item) {
  const colorIndex = item.selectedColorIndex || 0;
  const colorObject = item.Colors[colorIndex];
  const image = colorObject.ColorPreviewImageSrc;

  return `
    <li class="cart-card divider">

      <span
        class="removeWishlist cart-card__remove"
        data-id="${item.Id}">
        ❌
      </span>

      <a href="#" class="cart-card__image">
        <img
          src="${image}"
          alt="${item.NameWithoutBrand}"
        />
      </a>

      <a href="#">
        <h2 class="card__name">
          ${item.NameWithoutBrand}
        </h2>
      </a>

      <p class="cart-card__color">
        ${colorObject.ColorName}
      </p>

      <p class="cart-card__price">
        $${Number(item.FinalPrice).toFixed(2)}
      </p>

      <p>
        <button
          class="moveToCart"
          data-id="${item.Id}">
          Move To Cart
        </button>
      </p>

    </li>
  `;
}

renderWishlistContents();

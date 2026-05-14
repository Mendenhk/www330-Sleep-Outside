import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  // Use ? to check if cartItems is an array before calling map, if not, provide an empty array and default to "Your cart is empty."
  const htmlItems = Array.isArray(cartItems) && cartItems.length ? cartItems.map((item) => cartItemTemplate(item)).join("") : "<li>Your cart is empty.</li>";
  const productList = document.querySelector(".product-list");

  productList.innerHTML = htmlItems;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

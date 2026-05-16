import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // im: Attach event listeners to all remove buttons
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.id);
    });
  });
}
// im: Remove an item from the cart
function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === id);
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">❌</span>
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

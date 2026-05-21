import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  // Clear and prepare the product list area
  document.querySelector(".product-list").innerHTML = "";

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".products").innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const TotalCost = costSumTotal();
  const DisplayElement = document.querySelector(".cart-footer");
  DisplayElement.style.display = "block";

  const totalCostElement = document.querySelector(".cart-total");
  totalCostElement.textContent = `Total: $${TotalCost.toFixed(2)}`;

  // Attach event listeners to all remove buttons
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.id);
    });
  });
}

// Remove an item from the cart and re-render
function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === id);
  
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

function costSumTotal() {
  const cartItems = getLocalStorage("so-cart") || [];
  
  return cartItems.reduce((acc, item) => {
    const quantity = item.quantity || 1;
    const price = Number(item.FinalPrice) || 0;
    return acc + price * quantity;
  }, 0);
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const totalPrice = (Number(item.FinalPrice) || 0) * quantity;

  return `<li class="cart-card divider">
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image.replace("./public", "")}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${quantity}</p>
    <p class="cart-card__price">$${totalPrice.toFixed(2)}</p>
  </li>`;
}

// Initialize cart
renderCartContents();
loadHeaderFooter();
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

function increaseCartQuantity(id) {
  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.map(item => {
    if (item.Id === id) {
      item.quantity = (item.quantity || 1) + 1;
    }
    return item;
  });
  
  setLocalStorage("so-cart", cartItems); 
  renderCartContents();
}

function decreaseCartQuantity(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  
  cartItems = cartItems.map(item => {
    if (item.Id === id) {
      const currentQty = item.quantity || 1;
      if (currentQty > 1) {
        item.quantity = currentQty - 1;
      }
    }
    return item;
  });
  
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // Clear the product list
  document.querySelector(".product-list").innerHTML = "";

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".products").innerHTML = `
      <h2>My Cart</h2>
      <p>Your cart is empty.</p>
    `;
    return;
  }

  // Render cart items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // === FIX: Create footer if it doesn't exist ===
  let footerElement = document.querySelector(".cart-footer");
  if (!footerElement) {
    footerElement = document.createElement("div");
    footerElement.className = "cart-footer";
    footerElement.innerHTML = `<p class="cart-total"></p>`;
    document.querySelector(".products").appendChild(footerElement);
  }

  const TotalCost = costSumTotal();

  footerElement.style.display = "block";

  const totalCostElement = document.querySelector(".cart-total");
  if (totalCostElement) {
    totalCostElement.textContent = `Total: $${TotalCost.toFixed(2)}`;
  }

  // Attach remove button listeners
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.id);
    });
  });
  const plusButtons = document.querySelectorAll(".btn-plus");
  plusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      increaseCartQuantity(button.dataset.id);
    });
  });

  const minusButtons = document.querySelectorAll(".btn-minus");
  minusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      decreaseCartQuantity(button.dataset.id);
    });
  });
}

// Remove item
function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === id);

  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

// Calculate total
function costSumTotal() {
  const cartItems = getLocalStorage("so-cart") || [];
  return cartItems.reduce((acc, item) => {
    const quantity = item.quantity || 1;
    const price = Number(item.FinalPrice) || 0;
    return acc + price * quantity;
  }, 0);
}

// Cart item template
function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const totalPrice = (Number(item.FinalPrice) || 0) * quantity;

  return `<li class="cart-card divider">
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
    <a href="#" class="cart-card__image">
      <img src="${item.Image.replace("./public", "")}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">
      <button class="btn-plus" data-id="${item.Id}">+</button>
      qty: ${quantity}
      <button class="btn-minus" data-id="${item.Id}">-</button>
    </p>
    <p class="cart-card__price">$${totalPrice.toFixed(2)}</p>
  </li>`;
}

// Initialize
renderCartContents();
loadHeaderFooter();
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  document.querySelector(".products").innerHTML += `<div class="cart-footer">
  <p class="cart-total"> </p></div>`;

  if (cartItems == null) {
    console.log("localStorage array is null.");
  } else {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    const TotalCost = costSumTotal();
    const DisplayElement = document.querySelector(".cart-footer");
    if (DisplayElement.style.display === 0) {
      DisplayElement.style.display = "block";
    }

    const totalCostElement = document.querySelector(".cart-total");
    totalCostElement.textContent = `Total: $${TotalCost}`;

    // im: Attach event listeners to all remove buttons
    const removeButtons = document.querySelectorAll(".cart-card__remove");
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        removeFromCart(button.dataset.id);
      });
    });
  }
}

// im: remove an item from the cart and re-render
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
  const cartItems = getLocalStorage("so-cart");

  const totalSum = cartItems.reduce((acc, items) => {
    const quantity = items.quantity || 1;
    const price = Number(items.FinalPrice) || 0;
    return acc + price * quantity;
  }, 0);
  return totalSum;
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const totalPrice = (Number(item.FinalPrice) || 0) * quantity;
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
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${totalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

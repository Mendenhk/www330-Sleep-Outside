import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  document.querySelector(".products").innerHTML += `<div class="cart-footer">
  <p class="cart-total"> </p></div>`;

  if (cartItems == null) {
    console.log("localStorage array is null.")
  } else {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    const TotalCost = costSumTotal()
    const DisplayElement = document.querySelector(".cart-footer")
    if (DisplayElement.style.display === 0) {
      DisplayElement.style.display = "block"
    }

    const totalCostElement = document.querySelector(".cart-total");
    totalCostElement.textContent = `Total: $${TotalCost}`
  }
}



function costSumTotal() {
  const cartItems = getLocalStorage("so-cart");

  const totalSum = cartItems.reduce((acc, items) => {
    return acc + (Number(items.FinalPrice) || 0)
  }, 0);
  return totalSum
};

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

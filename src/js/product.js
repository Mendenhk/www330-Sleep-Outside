import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
// --bellow was my original solution, but I made it more like the example solution by moving it into the function because it seems less likely to encounter bugs by being a temporary variable.
//let cartList = getLocalStorage("so-cart") || [];

function addProductToCart(product) {
  const cartList = getLocalStorage("so-cart") || [];
  cartList.push(product);
  setLocalStorage("so-cart", cartList);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

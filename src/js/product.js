import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  //km wk1 ind. act. step 3-1 (next 3 lines of code).  Five steps: retrieve data, convert to object, add item, convert back to JSON, save item.
  let cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  cartItems.push(product);
  localStorage.setItem("so-cart", JSON.stringify(cartItems));
  // setLocalStorage("so-cart", product);  //original code replaced by above three lines (to be deleted)
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

import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  //km wk1 ind. act. step 3-1 (next 3 lines of code).  Five steps: retrieve data, convert to object, add item, convert back to JSON, save item.  (the actual solution, see below, did not include JSON conversion for the reasons stated below.  As such my code can be deleted-below three lines of code)
  // let cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  // cartItems.push(product);
  // localStorage.setItem("so-cart", JSON.stringify(cartItems));
  // setLocalStorage("so-cart", product);  //original code replaced by above three lines (to be deleted)
  //below, the actual solution.  Note that JSON conversion is missing.  These are handled by the function setLocalStorage().  
  const cartItems = getLocalStorage("so-cart") || []; // get cart array of items from local storage if null set to empty array
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
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

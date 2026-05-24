import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

//kriston: added to update cart icon
import { updateCartCount } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

//kriston: modified loadHeaderFooter to await so the cart subscript will find it.
async function init() {
  listing.init();
  await loadHeaderFooter();
  updateCartCount();
}

init();

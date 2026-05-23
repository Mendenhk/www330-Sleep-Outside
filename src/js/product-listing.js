import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

const dataSource = new ProductData("tents");
const category = getParam("category");
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);

//kriston: modified loadHeaderFooter to await so the cart subscript will find it.  
async function init() {
  productList.init();
  await loadHeaderFooter();
  updateCartCount();
}

init();
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

const category = getParam('category');

const titleElement = document.querySelector(".products h2");
titleElement.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

const dataSource = new ProductData();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

//kriston: modified loadHeaderFooter to await so the cart subscript will find it.  
async function init() {
  productList.init();
  await loadHeaderFooter();
  updateCartCount();
}

init();
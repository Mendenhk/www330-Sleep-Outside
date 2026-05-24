import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";

const category = getParam("category") || "tents";
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const capitalizedCategory = category
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
const categoryTitleElement = document.getElementById("category-title");

if (categoryTitleElement) {
  categoryTitleElement.textContent = capitalizedCategory;
}

const productList = new ProductList(category, dataSource, element);

async function init() {
  await loadHeaderFooter();
  await productList.init();
  updateCartCount();
}

init();

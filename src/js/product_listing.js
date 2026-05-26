import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

const category = getParam("category") || "tents";
const displayNames = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks",
};

const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const productsHeading = document.getElementById("products-heading");
const productList = new ProductList(category, dataSource, element);

async function init() {
  await loadHeaderFooter();
  updateCartCount();
  productsHeading.textContent = `Top Products: ${displayNames[category] || "Tents"}`;
  await productList.init();
}

init();
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);
const alert = new Alert();

//kriston: modified loadHeaderFooter to await so the cart subscript will find it.  
async function init() {
  await alert.init();
  productList.init();
  await loadHeaderFooter();
  updateCartCount();
}

init();

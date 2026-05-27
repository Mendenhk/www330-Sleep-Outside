import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);
const alert = new Alert();

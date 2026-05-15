import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

let productDataInstance = new ProductData("tents");

const listElement = document.querySelector(".product-list");
const productListInstance = new ProductList("tents", productDataInstance, listElement);

import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';


const dataSource = new ProductData("tents");
const productList = new ProductList("tents", dataSource, document.getElementById("product-list"));
const element = document.querySelector(".product-list");

productList.init();
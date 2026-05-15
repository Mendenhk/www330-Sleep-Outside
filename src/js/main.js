import ProductData from "./ProductData.mjs";
//km: ProductData is a class.
import ProductList from "./ProductList.mjs";

let productData = new ProductData('tents');

const listElement = document.querySelector('.product-list');
const productList = new ProductList('tents', productDataInstance, listElement);
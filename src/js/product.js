import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";



const dataSource = new ProductData();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

//kriston: modified loadHeaderFooter to await so the cart subscript will find it.  
// Initialize
async function init() {
  await loadHeaderFooter();
  updateCartCount();
}

init();
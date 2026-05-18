import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");


function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];

  // Buscar si el producto ya existe en el carrito
  const existingItem = cartItems.find((item) => item.Id === product.Id);

  if (existingItem) {
    // Si ya existe, incrementar quantity
    existingItem.quantity += 1;
  } else {
    // Si no existe, agregar quantity = 1
    product.quantity = 1;
    cartItems.push(product);
  }

  setLocalStorage("so-cart", cartItems);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

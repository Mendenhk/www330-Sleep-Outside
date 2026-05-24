import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    // Check if product already exists in cart
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);
    
    if (existingItem) {
      // If product exists, increment quantity
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // If product doesn't exist, add it with quantity 1
      this.product.quantity = 1;
      cartItems.push(this.product);
    }
    
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // Brand name
  document.querySelector("h3").textContent = product.Brand.Name;

  // Product title
  document.querySelector("h2").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");

  // Fix image path for product pages
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;

  document.getElementById("productColor").textContent =
    product.Colors[0].ColorName;

  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
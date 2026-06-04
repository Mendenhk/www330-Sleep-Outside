import {
  getLocalStorage,
  setLocalStorage,
  setBreadcrumb,
  getParam
} from "./utils.mjs";

// kriston: below added for backpack superscript cart counter
import { updateCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    // determine category of product for breadcrumbs
    const categoryParam = getParam("category");
    const inferredCategory =
      this.product?.Category?.Name ||
      this.product?.CategoryName ||
      document.querySelector(".title")?.textContent ||
      null;

    const category = categoryParam || inferredCategory;
    const productName =
      this.product?.NameWithoutBrand ||
      this.product?.Name ||
      null;

    setBreadcrumb({
      type: "product",
      category,
      productName
    });

    this.renderProductDetails();

    // Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener(
        "click",
        this.addProductToCart.bind(this)
      );

    // Add to Wishlist button
    document
      .getElementById("addToWishlist")
      .addEventListener(
        "click",
        this.addProductToWishlist.bind(this)
      );
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];

    const existingItem = cartItems.find(
      (item) => item.Id === this.product.Id
    );

    if (existingItem) {
      existingItem.quantity =
        (existingItem.quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);

    updateCartCount();
  }

  addProductToWishlist() {
    const wishlistItems =
      getLocalStorage("so-wishlist") || [];

    const existingItem = wishlistItems.find(
      (item) => item.Id === this.product.Id
    );

    if (!existingItem) {
      wishlistItems.push(this.product);

      setLocalStorage(
        "so-wishlist",
        wishlistItems
      );

      alert("Added to wishlist!");
    } else {
      alert("Already in wishlist!");
    }
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  const colorIndex =
    sessionStorage.getItem("colorIndex") || 0;

  product.selectedColorIndex = colorIndex;

  sessionStorage.removeItem("colorIndex");

  const colorObject = product.Colors[colorIndex];

  console.log("colorObject = ", colorObject);

  const colorImage =
    colorObject.ColorPreviewImageSrc;

  // Brand name
  document.querySelector("h3").textContent =
    product.Brand.Name;

  // Product title
  document.querySelector("h2").textContent =
    product.NameWithoutBrand;

  const productImage =
    document.getElementById("productImage");

  productImage.src = colorImage;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById(
    "productPrice"
  ).textContent = `$${product.FinalPrice}`;

  document.getElementById(
    "productColor"
  ).textContent =
    product.Colors[colorIndex].ColorName;

  document.getElementById(
    "productDesc"
  ).innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById(
    "addToCart"
  ).dataset.id = product.Id;

  

  // Carousel logic using Colors
  const thumbnailsContainer = document.getElementById("carouselThumbnails");
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = "";

    if (product.Colors && product.Colors.length > 1) {
      let currentIndex = Number(colorIndex);

      function updateCarousel(index) {
        const color = product.Colors[index];
        document.getElementById("productImage").src = color.ColorPreviewImageSrc;
        document.getElementById("productColor").textContent = color.ColorName;
        document.querySelectorAll(".carousel-thumb").forEach((t, i) => {
          t.classList.toggle("active", i === index);
        });
        currentIndex = index;
      }

      product.Colors.forEach((color, index) => {
        const thumb = document.createElement("img");
        thumb.src = color.ColorPreviewImageSrc;
        thumb.alt = color.ColorName;
        thumb.classList.add("carousel-thumb");
        if (index === currentIndex) thumb.classList.add("active");

        thumb.addEventListener("click", () => updateCarousel(index));
        thumbnailsContainer.appendChild(thumb);
      });

      const prevBtn = document.getElementById("carouselPrev");
      const nextBtn = document.getElementById("carouselNext");

      if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
          const newIndex = (currentIndex - 1 + product.Colors.length) % product.Colors.length;
          updateCarousel(newIndex);
        });

        nextBtn.addEventListener("click", () => {
          const newIndex = (currentIndex + 1) % product.Colors.length;
          updateCarousel(newIndex);
        });
      }
    }
  }


  const wishlistButton =
    document.getElementById("addToWishlist");

  if (wishlistButton) {
    wishlistButton.dataset.id = product.Id;
  }
}
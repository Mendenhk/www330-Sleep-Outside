import { renderListWithTemplate } from "./utils.mjs";

// Current template for Product card with discount indicator
function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  const discountPercent = Math.round(
    ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) *
    100
  );

  return `
    <li class="product-card">
      ${isDiscounted
      ? `<span class="discount-badge">${discountPercent}% OFF</span>`
      : ""
    }

      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>

        ${isDiscounted
      ? `<p class="original-price">$${product.SuggestedRetailPrice}</p>`
      : ""
    }
      </a>
    </li>
  `;
}

export default class ProductList {
  // Extracts JSON files
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    // NEW: store products + sort state
    this.products = [];
    this.sortAsc = true;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.products = list;
    this.renderList(this.products);
    document.querySelector(".title").textContent = this.category;
    // attach sort button listener
    this.setupSort();
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  setupSort() {
    const sortButton = document.getElementById("sort-btn");
    sortButton.addEventListener("click", () => {
      this.sortAsc = !this.sortAsc;
      this.products.sort((a, b) => {
        if (this.sortAsc) {
          return a.FinalPrice - b.FinalPrice;
        } else {
          return b.FinalPrice - a.FinalPrice;
        }
      });
      this.renderList(this.products);
    });
  }
}
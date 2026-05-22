import { renderListWithTemplate } from "./utils.mjs";

// Current template for Product card with discount indicator
function productCardTemplate(product) {
  const isDiscounted =
    product.FinalPrice < product.SuggestedRetailPrice;

  const discountPercent = Math.round(
    ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) *
      100
  );

  return `
    <li class="product-card">

      ${
        isDiscounted
          ? `
        <span class="discount-badge">
          ${discountPercent}% OFF
        </span>
      `
          : ""
      }

      <a href="./product_pages/index.html?product=${product.Id}">

        <img
          src="${product.Image.replace('./public', '')}"
          alt="${product.Name}"
        >

        <h2>${product.Brand.Name}</h2>

        <h3>${product.Name}</h3>

        <p class="product-card__price">
          $${product.FinalPrice}
        </p>

        ${
          isDiscounted
            ? `
          <p class="original-price">
            $${product.SuggestedRetailPrice}
          </p>
        `
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
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
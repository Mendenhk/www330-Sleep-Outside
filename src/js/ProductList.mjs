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
  }

  async init() {
    this.list = await this.dataSource.getData(this.category);
    // console.log(this.list);
    this.renderList(this.list);
    document.querySelector(".title").textContent = this.category;

    //kriston: below-code for sort buttons to render sorted list
    const priceSort = document.getElementById("sort-by-price");
    const nameSort = document.getElementById("sort-by-name");
    nameSort.addEventListener("click", () => this.sortList("Name"));
    priceSort.addEventListener("click", () => this.sortList("FinalPrice"));
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  //kriston: adding a sorting method
  sortList(category) {
    this.list.sort((a, b) => {
      if (typeof a[category] === "number") {
        return a[category] - b[category];
      } else {
        return a[category].localeCompare(b[category]);
      }
    });

    this.renderList(this.list);
  }
}
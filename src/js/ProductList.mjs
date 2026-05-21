import { renderListWithTemplate } from "./utils.mjs";

// Current template for Product card //
// function productCardTemplate(product) {
//   return `
//     <li class="product-card">
//       <a href="./product_pages/index.html?product=${product.Id}">
//         <img src="${product.Image.replace('./public', '')}" alt="${product.Name}">
//         <h2>${product.Brand.Name}</h2>
//         <h3>${product.Name}</h3>
//         <p class="product-card__price">$${product.FinalPrice}</p>
//       </a>
//     </li>
//   `;
// }

// Sam Levi Samson - New Product Card Template - Discount Indicator Added at the Cart //

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
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}

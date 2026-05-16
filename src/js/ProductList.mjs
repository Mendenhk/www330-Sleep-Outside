import { renderListWithTemplate } from "./utils.mjs";

// im: Product Card template function to dynamically build each product card.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Image}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

//im: following class extracts JSON files
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  async init() {
    //im: I removed fetch() here because the data source does that now.
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    //im: Filter out the products that do not have images
    const filteredList = list.filter(item => ["880RR", "985RF", "985PR", "344YJ"].includes(item.Id));
    
    //im: Use the utility function to render the list with the template
    renderListWithTemplate(productCardTemplate, this.listElement, filteredList);
  }
}

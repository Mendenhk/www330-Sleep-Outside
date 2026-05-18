function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=">
      <img src="" alt="Image of ">
      <h2 class="card__brand"></h2>
      <h3 class="card__name"></h3>
      <p class="product-card__price">$</p>
      <p class="product-card__discount"></p>
    </a>
  </li>`
}

//following class extracts JSON files
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  async init() {
    const list = await fetch(this.dataSource);
  }
}

function renderlist(list) {
  const htmlStrings = list.map(productCardTemplate)
  this.listElement.insertAdjacentHTML('afterbegin', htmlStrings.join(''))
};

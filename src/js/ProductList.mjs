import { renderListWithTemplate, setBreadcrumb } from "./utils.mjs";

// Current template for Product card with discount indicator
function productCardTemplate(product, category) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  const discountPercent = Math.round(
    ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) *
    100
  );

  // Build the product page link with category as a query parameter for breadcrumbs
  const href = `/product_pages/?product=${product.Id}${category ? `&category=${encodeURIComponent(category)}` : ""}`;

  return `
    <li class="product-card">
      ${isDiscounted
      ? `<span class="discount-badge">${discountPercent}% OFF</span>`
      : ""
    }

      <a href="${href}">
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

    this.sortProducts = []

    //build an all product lis
    this.back = [];
    this.ham = [];
    this.sleep = [];
    this.ten = [];
    this.all = [];
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.products = list;
    document.querySelector(".title").textContent = this.category;
    //search for specific product by name, 
    const list2 = await this.dataSource.getData("backpacks");
    const list3 = await this.dataSource.getData("hammocks");
    const list4 = await this.dataSource.getData("sleeping-bags");
    const list5 = await this.dataSource.getData("tents");

    // all product list build
    this.back = list2;
    this.ham = list3;
    this.sleep = list4;
    this.ten = list5;

    const allProduct = [...list2, ...list3, ...list4, ...list5]
    this.all = allProduct
    //if category is not tents, backpacks, sleeping-bags, or hammocks
    //then run searchList function, otherwise render list as normal.
    if (this.category == "tents" || this.category == "backpacks" || this.category == "sleeping-bags" || this.category == "hammocks") {
      // set breadcrumb for category list
      setBreadcrumb({ type: "list", category: this.category, count: this.products.length });
      this.renderList(this.products);
    } else {
      this.searchList(this.category)
    }

    // attach sort button listener
    this.setupSort();

    //Kriston: added to create sort by name button
    const nameSort = document.getElementById("sort-by-name");
    nameSort.addEventListener("click", () => this.sortList("Name"));
  }

  searchList(query) {



    let testing = this.all.filter(product => product.Name.toLowerCase().includes(query.toLowerCase()))
    console.log(testing)

    this.sortProducts = testing;
    this.renderList(this.sortProducts)
  }

  renderList(list) {
    renderListWithTemplate((p) => productCardTemplate(p, this.category), this.listElement, list);
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

  //kriston: method added to generate sort by name list.  Can also sort by other categories if needed.
  sortList(category) {
    this.products.sort((a, b) => {
      if (typeof a[category] === "number") {
        return a[category] - b[category];
      } else {
        return a[category].localeCompare(b[category]);
      }
    });

    this.renderList(this.products);
  }
}
//kriston: next figure out how to make my colors change
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
    <li class="product-card" data-product-id="${product.Id}">
      ${isDiscounted
      ? `<span class="discount-badge">${discountPercent}% OFF</span>`
      : ""
    }

      ${product.Colors.length === 1 ? `<a href="/product_pages/?product=${product.Id}">` : ""}
    <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
      <h3>${product.Brand.Name}</h3>
      <p>${product.NameWithoutBrand}</p>

      ${colorListTemplate(product.Colors, product)}
        
      <p class="product-card__price">$${product.FinalPrice}</p>
      ${isDiscounted
        ? `<p class="original-price">$${product.SuggestedRetailPrice}</p>`
        : ""
      }
      ${product.Colors.length === 1 ? `</a>` : ""}
    </li>
  `;
}

//kriston: create a list of color options
function colorListTemplate(objectList, product) {
  let colorList = `<ul class="color-options ${objectList.length > 1 ? "clickable" : ""}">`;
    objectList.forEach((element, index) => {
      colorList += `
        <li ${index ===0 ? `class="active-color"` : ""} data-index="${index}" data-product-id="${product.Id}">
          <img src="${element.ColorChipImageSrc}">
          <p class="product_color">Color: ${element.ColorName}</p>
        </li>
      `
    });
  colorList += `</ul>`
  colorList += `<button class="color-choice-button ${objectList.length === 1 ? "hide-color-button" : ""}">Choose this Color</button>`;
  return colorList;
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

    //Kriston: added to create sort by name button
    const nameSort = document.getElementById("sort-by-name");
    nameSort.addEventListener("click", () => this.sortList("Name"));

    //kriston: add event listener to color choices
    const colorButtons = document.querySelectorAll(".clickable");
    colorButtons.forEach(ul => {
      ul.addEventListener("click", (event) => {
        //stops the parent click event so this one can occur
        // event.preventDefault()
        const clickedLi = event.target.closest("li");
        if (clickedLi) {
          this.displayChosenColor(ul, clickedLi);
        }
      });
    });
    
    const chooseColorButton = document.querySelectorAll(".color-choice-button");
    chooseColorButton.forEach(button => {
      button.addEventListener("click", () => {
        const productId = button.closest(".product-card").dataset.productId;
        const selectedIndex = button.previousElementSibling.dataset.selectedIndex;
        //kriston: saving colorIndex to session storage to retrieve on cart, for proper displaying of the correct image.
        sessionStorage.setItem("colorIndex", selectedIndex);
        window.location.href = `/product_pages/?product=${productId}`;
      });
    });
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

  //kriston: display chosen color
  displayChosenColor(ul, clickedLi) {
    const colorIndex = clickedLi.dataset.index;
    ul.dataset.selectedIndex = colorIndex;
    const productId = clickedLi.dataset.productId;
    const clickedProduct = this.products.find((product) => {
      return product.Id === productId;
    });
    // console.log(clickedProduct);
    const productColorObject = clickedProduct.Colors[colorIndex];
    // console.log(productColorObject);
    const mainImage = ul.parentElement.querySelector("img")
    // console.log(mainImage);
    mainImage.src = productColorObject.ColorPreviewImageSrc;
    ul.querySelector(".active-color").classList.remove("active-color");
    clickedLi.classList.add("active-color");
  }
}


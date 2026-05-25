export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}


export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}


export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}


export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  updateCartCount();
  initSearch();
}


export function initSearch() {
  const searchForm = document.querySelector(".search-form");
  if (!searchForm) return;

  searchForm.addEventListener ("submit", (event) => {
    event.preventDefault();
    const query = document.querySelector(".search-input").value.trim();
    if (query) {
      window.location.href = `/product_listing/index.html?category=${encodeURIComponent(query)}`;
    }
  });
}

//kriston: code added to create a superscript on backpack icon
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = document.querySelector(".cart-count");

  const totalItems = cartItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  // remove the if statement when all pages contain the cart count.
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}


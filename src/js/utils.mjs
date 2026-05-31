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

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert, .alert-list");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
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

  // ensure breadcrumb element exists as a sibling after header so it sits below header border
  let breadcrumbEl = document.getElementById("site-breadcrumb");
  if (!breadcrumbEl) {
    breadcrumbEl = document.createElement("nav");
    breadcrumbEl.id = "site-breadcrumb";
    breadcrumbEl.className = "breadcrumb";
    breadcrumbEl.setAttribute("aria-label", "Breadcrumb");
    breadcrumbEl.style.display = "none";
    headerElement.insertAdjacentElement("afterend", breadcrumbEl);
  }
  setBreadcrumb();

  updateCartCount();
  initSearch();
}

function prettifyCategory(raw) {
  if (!raw) return "";
  return raw
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function setBreadcrumb({ type, category, count, productName } = {}) {
  const crumbElement = document.getElementById("site-breadcrumb");
  if (!crumbElement) return;

  // hide when no breadcrumb data provided
  if (!type) {
    crumbElement.style.display = "none";
    crumbElement.innerHTML = "";
    return;
  }

  const pretty = prettifyCategory(category);

  if (type === "list") {
    const href = category ? `/product_listing/index.html?category=${encodeURIComponent(category)}` : "#";
    crumbElement.innerHTML = `<a class="crumb-link" href="${href}"><span class="crumb-cat">${pretty}</span></a> <span class="crumb-sep">-&gt;</span> <span class="crumb-count">(${count} items)</span>`;
    crumbElement.style.display = "block";
    return;
  }

  if (type === "product") {
    // product page shows category as a link back to the listing when available
    if (category) {
      const href = `/product_listing/index.html?category=${encodeURIComponent(category)}`;
      if (productName) {
        // show: Category -> Product Name
        crumbElement.innerHTML = `<a class="crumb-link" href="${href}"><span class="crumb-cat">${pretty}</span></a> <span class="crumb-sep">-&gt;</span> <span class="crumb-product">${productName}</span>`;
      } else {
        crumbElement.innerHTML = `<a class="crumb-link" href="${href}"><span class="crumb-cat">${pretty}</span></a>`;
      }
    } else {
      crumbElement.innerHTML = `<span class="crumb-cat">${pretty || "Products"}</span>`;
    }
    crumbElement.style.display = "block";
    return;
  }

  // hide by default if type is not found
  crumbElement.style.display = "none";
  crumbElement.innerHTML = "";
}

export function initSearch() {
  const searchForm = document.querySelector(".search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", (event) => {
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

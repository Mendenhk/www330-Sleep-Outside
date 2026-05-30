import { getLocalStorage } from "./utils.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const order = {};

  formData.forEach((value, key) => {
    order[key] = value;
  });

  return order;
}

export default class CheckoutProcess {
  constructor(key, outputSelector, services) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.services = services;
    this.cartItems = [];
    this.itemTotal = 0;
    this.shippingCost = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.cartItems = getLocalStorage(this.key) || [];
    this.calculateItemSubtotal();
    this.displayItemSubtotal();
  }

  calculateItemSubtotal() {
    this.itemTotal = this.cartItems.reduce(
      (total, item) => total + Number(item.FinalPrice) * (item.quantity || 1),
      0,
    );
  }

  calculateOrderTotal() {
    this.calculateItemSubtotal();
    this.tax = this.itemTotal * 0.06;
    this.shippingCost =
      this.cartItems.length > 0 ? 10 + (this.cartItems.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shippingCost;
    this.displayOrderSummary();
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1,
    }));
  }

  normalizeCardNumber(cardNumber) {
    return cardNumber.replace(/\D/g, "");
  }

  normalizeExpirationDate(expirationDate) {
    const [month, year] = expirationDate.split("/");

    if (year.length === 2) {
      return `${month}/20${year}`;
    }

    return expirationDate;
  }

  async checkout(formElement) {
    const formData = formDataToJSON(formElement);
    const cardNumber = this.normalizeCardNumber(formData["card-number"]);
    const expiration = this.normalizeExpirationDate(
      formData["expiration-date"],
    );

    this.calculateOrderTotal();

    const order = {
      orderDate: new Date().toISOString(),
      fname: formData["first-name"],
      lname: formData["last-name"],
      street: formData["street-address"],
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber,
      expiration,
      code: formData.cvv,
      items: this.packageItems(this.cartItems),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: Number(this.shippingCost.toFixed(2)),
      tax: this.tax.toFixed(2),
    };

    try {
      const result = await this.services.checkout(order);
      return result;
    } catch (err) {
      console.error("CheckoutProcess.checkout error:", err);
      let message;
      if (err && err.message) {
        message = typeof err.message === "string" ? err.message : JSON.stringify(err.message);
      } else {
        message = JSON.stringify(err);
      }
      throw new Error(message);
    }
  }

  displayItemSubtotal() {
    const summaryElement = document.querySelector(this.outputSelector);

    if (!summaryElement) return;

    if (this.cartItems.length === 0) {
      summaryElement.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    summaryElement.innerHTML = `
      <p><span>Subtotal</span><strong>$${this.itemTotal.toFixed(2)}</strong></p>
    `;
  }

  displayOrderSummary() {
    const summaryElement = document.querySelector(this.outputSelector);

    if (!summaryElement) return;

    if (this.cartItems.length === 0) {
      summaryElement.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    summaryElement.innerHTML = `
      <p><span>Subtotal</span><strong>$${this.itemTotal.toFixed(2)}</strong></p>
      <p><span>Tax</span><strong>$${this.tax.toFixed(2)}</strong></p>
      <p><span>Shipping Estimate</span><strong>$${this.shippingCost.toFixed(2)}</strong></p>
      <p><span>Order Total</span><strong>$${this.orderTotal.toFixed(2)}</strong></p>
    `;
  }
}

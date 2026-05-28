import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
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

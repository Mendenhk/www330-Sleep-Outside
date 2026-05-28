import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();
const checkoutProcess = new CheckoutProcess("so-cart", "#order-summary", services);
const checkoutForm = document.querySelector(".checkout-form");

checkoutProcess.init();

document.querySelector("#zip").addEventListener("input", (event) => {
  if (event.target.value.trim()) {
    checkoutProcess.calculateOrderTotal();
  } else {
    checkoutProcess.displayItemSubtotal();
  }
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  try {
    await checkoutProcess.checkout(checkoutForm);
    alert("Order submitted successfully.");
  } catch (error) {
    alert(`There was a problem submitting your order: ${error.message}`);
  }
});

loadHeaderFooter();

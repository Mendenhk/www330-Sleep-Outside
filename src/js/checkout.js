import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();
const checkoutProcess = new CheckoutProcess(
  "so-cart",
  "#order-summary",
  services,
);
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
    localStorage.removeItem("so-cart");
    window.location.href = "./success.html";
  } catch (error) {
    const cleanError = error.message
      .substring(error.message.indexOf(":") + 1)
      .trim()
      .replaceAll("{", "")
      .replaceAll("}", "");
    alert(`There was a problem submitting your order: ${cleanError}`);
  }
});

loadHeaderFooter();

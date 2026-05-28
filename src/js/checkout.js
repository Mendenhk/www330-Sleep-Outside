import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

const checkoutProcess = new CheckoutProcess("so-cart", "#order-summary");
checkoutProcess.init();

document.querySelector("#zip").addEventListener("input", (event) => {
  if (event.target.value.trim()) {
    checkoutProcess.calculateOrderTotal();
  } else {
    checkoutProcess.displayItemSubtotal();
  }
});

loadHeaderFooter();

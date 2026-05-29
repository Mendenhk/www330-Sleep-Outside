import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);
const alert = new Alert();





const modal = document.getElementById("giveawayModal");
const closeBtn = document.getElementById("closeModal");
const hasSeenModal = localStorage.getItem("hasSeenWelcomeModal");

if (!hasSeenModal) {
  modal.showModal();
  localStorage.setItem("hasSeenWelcomeModal", "true");
}

closeBtn.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (e) => {
  const dialogDimensions = modal.getBoundingClientRect();

  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close();
  }
});


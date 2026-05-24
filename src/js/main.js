import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

//kriston: modified loadHeaderFooter to await so the cart subscript will find it.  
async function init() {
  await loadHeaderFooter();
  updateCartCount();
}

init();
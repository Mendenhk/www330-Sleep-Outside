import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import ProductReviews from "./productReviews.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

// ADD THESE TWO LINES — initialize the review section for this product
const reviews = new ProductReviews(productID);
reviews.init();
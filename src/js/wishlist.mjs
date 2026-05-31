import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const wishlistKey = "so-wishlist";

export function getWishlist() {
  return getLocalStorage(wishlistKey) || [];
}

export function addToWishlist(product) {
  const wishlist = getWishlist();

  const exists = wishlist.find(
    (item) => item.Id === product.Id
  );

  if (!exists) {
    wishlist.push(product);
    setLocalStorage(wishlistKey, wishlist);
  }
}

export function removeFromWishlist(productId) {
  const wishlist = getWishlist().filter(
    (item) => item.Id !== productId
  );

  setLocalStorage(wishlistKey, wishlist);
}
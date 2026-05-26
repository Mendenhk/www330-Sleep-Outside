const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {}

  async getData(category) {
    if (baseURL) {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result;
    }
    const path = `/json/${category}.json`;
    const response = await fetch(path);
    return convertToJson(response);
  }

  async findProductById(id) {
    if (baseURL) {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    }
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    for (const category of categories) {
      const products = await this.getData(category);
      const match = products.find((item) => item.Id === id);
      if (match) {
        return match;
      }
    }
    return null;
  }
}
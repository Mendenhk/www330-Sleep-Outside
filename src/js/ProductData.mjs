function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// Map incoming category query values to the JSON filenames
const mapCategoryToFile = {
  tents: "tents",
  backpacks: "backpacks",
  sleepingbags: "sleeping-bags",
};

export default class ProductData {
  // Load a local JSON file from /public/json based on the category
  async getData(category) {
    const key = category || "tents";
    const fileName = mapCategoryToFile[key] || key;
    const response = await fetch(`/public/json/${fileName}.json`);
    const data = await convertToJson(response);
    return data;
  }

  // Search all category files for a product by id
  async findProductById(id) {
    const files = Object.values(mapCategoryToFile);
    for (const file of files) {
      const response = await fetch(`/public/json/${file}.json`);
      const list = await convertToJson(response);
      const found = list.find((item) => item.Id === id);
      if (found) return found;
    }
    return null;
  }
}
const baseURL = import.meta.env.DEV ? "/api/" : import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {

  const responseText = await res.text();
  let data = responseText;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    data = responseText || res.statusText;
  }

  if (res.ok) {
    return data;
  } else {
    throw {
      name: "servicesError",
      message: data || res.statusText,
      status: res.status,
    };
  }
}


export default class ExternalServices {
  constructor(category) {
    // this.category = category;
    // this.path = `/json/${this.category}.json`;
  }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }

  async checkout(order) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }

  async createUser(user) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };

    const response = await fetch(`${baseURL}users`, options);
    return convertToJson(response);
  }
}

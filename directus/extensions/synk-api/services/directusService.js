const axios = require("axios");
const { getHeaders } = require("../utils/headers");

const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;
const DIRECTUS_API_KEY = process.env.DIRECTUS_API_KEY;

// Create a product in Directus
const createProductInDirectus = async (collectionName, data) => {
  const response = await axios.post(
    `${DIRECTUS_API_URL}/items/${collectionName}`,
    data,
    { headers: getHeaders(DIRECTUS_API_KEY) }
  );
  return response.data.data;
};

// Update a product in Directus
const updateProductInDirectus = async (collectionName, productId, updates) => {
  const response = await axios.patch(
    `${DIRECTUS_API_URL}/items/${collectionName}/${productId}`,
    updates,
    { headers: getHeaders(DIRECTUS_API_KEY) }
  );
  return response.data.data;
};

// Delete a product in Directus
const deleteProductInDirectus = async (collectionName, productId) => {
  await axios.delete(`${DIRECTUS_API_URL}/items/${collectionName}/${productId}`, {
    headers: getHeaders(DIRECTUS_API_KEY),
  });
};

// Fetch a product from Directus
const getProductFromDirectus = async (collectionName, productId) => {
  const response = await axios.get(
    `${DIRECTUS_API_URL}/items/${collectionName}/${productId}`,
    { headers: getHeaders(DIRECTUS_API_KEY) }
  );
  return response.data.data;
};

module.exports = {
  createProductInDirectus,
  updateProductInDirectus,
  deleteProductInDirectus,
  getProductFromDirectus,
};

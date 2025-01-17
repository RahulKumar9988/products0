const axios = require("axios");
const { getHeaders } = require("../utils/headers");

const MEDUSA_API_URL = process.env.MEDUSA_API_URL;
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY;

// Create a product in Medusa
const createProductInMedusa = async (product) => {
  const medusaProduct = {
    title: product.title,
    description: product.description,
    images: [product.image],
    prices: [
      {
        currency_code: "usd",
        amount: parseInt(product.price, 10),
      },
    ],
  };

  const response = await axios.post(
    `${MEDUSA_API_URL}/admin/products`,
    medusaProduct,
    { headers: getHeaders(MEDUSA_API_KEY) }
  );
  return response.data;
};

// Update a product in Medusa
const updateProductInMedusa = async (medusaProductId, updates) => {
  const medusaUpdates = {
    title: updates.title,
    description: updates.description,
    images: updates.image ? [updates.image] : undefined,
    prices: updates.price
      ? [
          {
            currency_code: "usd",
            amount: parseInt(updates.price, 10),
          },
        ]
      : undefined,
  };

  const response = await axios.post(
    `${MEDUSA_API_URL}/admin/products/${medusaProductId}`,
    medusaUpdates,
    { headers: getHeaders(MEDUSA_API_KEY) }
  );
  return response.data;
};

// Delete a product in Medusa
const deleteProductInMedusa = async (medusaProductId) => {
  await axios.delete(`${MEDUSA_API_URL}/admin/products/${medusaProductId}`, {
    headers: getHeaders(MEDUSA_API_KEY),
  });
};

module.exports = {
  createProductInMedusa,
  updateProductIn

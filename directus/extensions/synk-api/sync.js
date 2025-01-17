const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Base URLs and API keys from environment variables
const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;
const DIRECTUS_API_KEY = process.env.DIRECTUS_API_KEY;
const MEDUSA_API_URL = process.env.MEDUSA_API_URL;
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY;

// Utility to set headers
const getHeaders = (apiKey) => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
});

// Function to create a product in Medusa
const createProductInMedusa = async (product) => {
  const medusaProduct = {
    title: product.title,
    description: product.description,
    images: [product.image], // Ensure `image` is a valid URL
    prices: [
      {
        currency_code: "usd", // Change based on your configuration
        amount: parseInt(product.price, 10), // Convert price to integer if necessary
      },
    ],
  };

  try {
    const response = await axios.post(
      `${MEDUSA_API_URL}/admin/products`,
      medusaProduct,
      { headers: getHeaders(MEDUSA_API_KEY) }
    );
    console.log("Medusa Product Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating product in Medusa:", error.response?.data || error.message);
    throw new Error("Failed to sync product with Medusa");
  }
};

// Function to update a product in Medusa
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

  try {
    const response = await axios.put(
      `${MEDUSA_API_URL}/admin/products/${medusaProductId}`,
      medusaUpdates,
      { headers: getHeaders(MEDUSA_API_KEY) }
    );
    console.log("Medusa Product Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product in Medusa:", error.response?.data || error.message);
    throw new Error("Failed to sync product updates with Medusa");
  }
};

// Function to delete a product in Medusa
const deleteProductInMedusa = async (medusaProductId) => {
  try {
    await axios.delete(`${MEDUSA_API_URL}/admin/products/${medusaProductId}`, {
      headers: getHeaders(MEDUSA_API_KEY),
    });
    console.log(`Medusa Product Deleted: ${medusaProductId}`);
  } catch (error) {
    console.error("Error deleting product in Medusa:", error.response?.data || error.message);
    throw new Error("Failed to delete product in Medusa");
  }
};

// Create a new product in Directus and sync with Medusa
app.post("/products/create", async (req, res) => {
  const { collectionName, data } = req.body;

  if (!collectionName || !data) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    // Create product in Directus
    const directusResponse = await axios.post(
      `${DIRECTUS_API_URL}/items/${collectionName}`,
      data,
      { headers: getHeaders(DIRECTUS_API_KEY) }
    );
    console.log("Directus Product Created:", directusResponse.data);

    const directusProduct = directusResponse.data.data;

    // Sync product with Medusa
    const medusaResponse = await createProductInMedusa({
      title: directusProduct.title,
      description: directusProduct.description,
      price: directusProduct.price,
      image: directusProduct.image,
    });

    res.status(200).json({
      message: "Product created and synced successfully",
      directus: directusProduct,
      medusa: medusaResponse,
    });
  } catch (error) {
    console.error("Error creating and syncing product:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error creating and syncing product",
      error: error.response?.data || error.message,
    });
  }
});

// Update a product in Directus and sync with Medusa
app.put("/products/update/:id", async (req, res) => {
  const { id } = req.params;
  const { collectionName, data, medusaProductId } = req.body;

  if (!collectionName || !data || !medusaProductId) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    // Update product in Directus
    const directusResponse = await axios.patch(
      `${DIRECTUS_API_URL}/items/${collectionName}/${id}`,
      data,
      { headers: getHeaders(DIRECTUS_API_KEY) }
    );
    console.log("Directus Product Updated:", directusResponse.data);

    const directusProduct = directusResponse.data.data;

    // Sync updates with Medusa
    const medusaResponse = await updateProductInMedusa(medusaProductId, {
      title: directusProduct.title,
      description: directusProduct.description,
      price: directusProduct.price,
      image: directusProduct.image,
    });

    res.status(200).json({
      message: "Product updated and synced successfully",
      directus: directusProduct,
      medusa: medusaResponse,
    });
  } catch (error) {
    console.error("Error updating and syncing product:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error updating and syncing product",
      error: error.response?.data || error.message,
    });
  }
});

// Delete a product in Directus and Medusa
app.delete("/products/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { collectionName, medusaProductId } = req.body;

  if (!collectionName || !medusaProductId) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    // Delete product in Directus
    await axios.delete(`${DIRECTUS_API_URL}/items/${collectionName}/${id}`, {
      headers: getHeaders(DIRECTUS_API_KEY),
    });
    console.log(`Directus Product Deleted: ${id}`);

    // Delete product in Medusa
    await deleteProductInMedusa(medusaProductId);

    res.status(200).json({
      message: "Product deleted successfully from Directus and Medusa",
    });
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error deleting product",
      error: error.response?.data || error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

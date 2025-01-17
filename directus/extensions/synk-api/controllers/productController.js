const {
    createProductInDirectus,
    updateProductInDirectus,
    deleteProductInDirectus,
    getProductFromDirectus,
  } = require("../services/directusService");
  const {
    createProductInMedusa,
    updateProductInMedusa,
    deleteProductInMedusa,
  } = require("../services/medusaService");
  
  // Create operation
  const createProduct = async (req, res) => {
    const { collectionName, data } = req.body;
    try {
      const directusProduct = await createProductInDirectus(collectionName, data);
      const medusaProduct = await createProductInMedusa({
        title: directusProduct.title,
        description: directusProduct.description,
        price: directusProduct.price,
        image: directusProduct.image,
      });
  
      res.status(200).json({
        message: "Product created and synced successfully",
        directus: directusProduct,
        medusa: medusaProduct,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update operation
  const updateProduct = async (req, res) => {
    const { collectionName, productId, updates } = req.body;
    try {
      const updatedDirectusProduct = await updateProductInDirectus(
        collectionName,
        productId,
        updates
      );
      const medusaProductId = updatedDirectusProduct.medusa_id;
  
      const updatedMedusaProduct = await updateProductInMedusa(
        medusaProductId,
        updates
      );
  
      res.status(200).json({
        message: "Product updated and synced successfully",
        directus: updatedDirectusProduct,
        medusa: updatedMedusaProduct,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete operation
  const deleteProduct = async (req, res) => {
    const { collectionName, productId } = req.body;
    try {
      const directusProduct = await getProductFromDirectus(collectionName, productId);
      const medusaProductId = directusProduct.medusa_id;
  
      await deleteProductInDirectus(collectionName, productId);
      await deleteProductInMedusa(medusaProductId);
  
      res.status(200).json({ message: "Product deleted and synced successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = { createProduct, updateProduct, deleteProduct };
  
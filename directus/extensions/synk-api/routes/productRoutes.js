const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Routes
router.post("/create", createProduct);
router.post("/update", updateProduct);
router.post("/delete", deleteProduct);

module.exports = router;

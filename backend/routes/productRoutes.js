const express = require("express");
const multer = require("multer");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getProducts);
router.get("/related/:id", getRelatedProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
const express = require("express");
const {
  toggleWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/toggle", protect, toggleWishlist);
router.get("/", protect, getWishlist);

module.exports = router;
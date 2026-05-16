const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });

      return res.json({
        message: "Added to wishlist",
        wishlist,
      });
    }

    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();

      return res.json({
        message: "Removed from wishlist",
        wishlist,
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.json({
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Wishlist update failed",
      error: error.message,
    });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "name brand price discountPrice image size stock"
    );

    if (!wishlist) {
      return res.json({ products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Get wishlist failed",
      error: error.message,
    });
  }
};
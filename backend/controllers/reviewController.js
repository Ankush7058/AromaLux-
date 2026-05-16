const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      return res.json({
        message: "Review updated successfully",
        review: existingReview,
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Add review failed",
      error: error.message,
    });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        : 0;

    res.json({
      reviews,
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Get reviews failed",
      error: error.message,
    });
  }
};
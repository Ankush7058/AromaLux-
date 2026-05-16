const Product = require("../models/Product");
exports.createProduct = async (req, res) => {
  try {
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    console.log("FILES:", JSON.stringify(req.files, null, 2));

    const uploadedImages = req.files
      ? req.files.map((file) => file.path)
      : [];

    const product = await Product.create({
      ...req.body,
      image: uploadedImages[0] || req.body.image,
      images: uploadedImages,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR FULL:");
    console.log(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    res.status(500).json({
      message: "Create product failed",
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
   const { search, category, brand, gender, minPrice, maxPrice, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: "i" };
    if (gender) query.gender = gender;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    let sortOption = { createdAt: -1 };

if (sort === "price-low-high") {
  sortOption = { price: 1 };
}

if (sort === "price-high-low") {
  sortOption = { price: -1 };
}

if (sort === "newest") {
  sortOption = { createdAt: -1 };
}

if (sort === "oldest") {
  sortOption = { createdAt: 1 };
}

    const products = await Product.find(query)
      .populate("category", "name")
     .sort(sortOption);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Get products failed", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Get product failed", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

   if (req.files && req.files.length > 0) {
const uploadedImages = req.files.map((file) => file.path);
  updateData.image = uploadedImages[0];
  updateData.images = uploadedImages;
}

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Update product failed", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete product failed", error: error.message });
  }
};
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .sort({ createdAt: -1 });

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch related products",
      error: error.message,
    });
  }
};
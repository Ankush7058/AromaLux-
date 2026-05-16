const crypto = require("crypto");
const Razorpay = require("razorpay");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price discountPrice image stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      const price = item.product.discountPrice || item.product.price;
      totalAmount += price * item.quantity;

      return {
        product: item.product._id,
        name: item.product.name,
        price,
        quantity: item.quantity,
        image: item.product.image,
      };
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
      message: "Razorpay order created",
      order,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      message: "Create Razorpay order failed",
      error: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Get my orders failed", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Get all orders failed", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Update order failed", error: error.message });
  }
};

exports.createCODOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price discountPrice image stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      const price = item.product.discountPrice || item.product.price;
      totalAmount += price * item.quantity;

      return {
        product: item.product._id,
        name: item.product.name,
        price,
        quantity: item.quantity,
        image: item.product.image,
      };
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "COD order failed",
      error: error.message,
    });
  }
};
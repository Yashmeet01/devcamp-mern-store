import Product from "../models/Product.js";
import Order from "../models/Order.js";

const MAX_ITEMS = 50;
const MAX_QUANTITY = 10;
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

const isText = (value, min, max) =>
  typeof value === "string" &&
  value.trim().length >= min &&
  value.trim().length <= max;

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body || {};

    // 1. Validate the items list
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
      return res
        .status(400)
        .json({ message: `An order must contain between 1 and ${MAX_ITEMS} items.` });
    }

    // Combine repeated products into one quantity per product
    const quantities = new Map();
    for (const item of items) {
      const productId = item && item.productId;
      const quantity = item && item.quantity;

      if (typeof productId !== "string" || !OBJECT_ID_PATTERN.test(productId)) {
        return res.status(400).json({ message: "Invalid product in order." });
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res
          .status(400)
          .json({ message: "Quantity must be a whole number of at least 1." });
      }

      const key = productId.toLowerCase();
      quantities.set(key, (quantities.get(key) || 0) + quantity);
    }

    for (const quantity of quantities.values()) {
      if (quantity > MAX_QUANTITY) {
        return res
          .status(400)
          .json({ message: `You can order at most ${MAX_QUANTITY} of each product.` });
      }
    }

    // 2. Validate the shipping details
    const shipping = shippingAddress || {};
    if (!isText(shipping.fullName, 2, 100)) {
      return res.status(400).json({ message: "Full name must be at least 2 characters." });
    }
    if (typeof shipping.phone !== "string" || !/^[0-9]{10}$/.test(shipping.phone.trim())) {
      return res.status(400).json({ message: "Phone number must be 10 digits." });
    }
    if (!isText(shipping.address, 5, 200)) {
      return res.status(400).json({ message: "Address must be at least 5 characters." });
    }
    if (!isText(shipping.city, 2, 100)) {
      return res.status(400).json({ message: "City must be at least 2 characters." });
    }
    if (
      typeof shipping.postalCode !== "string" ||
      !/^[0-9]{6}$/.test(shipping.postalCode.trim())
    ) {
      return res.status(400).json({ message: "Postal code must be 6 digits." });
    }

    // 3. Load the REAL products and calculate the total on the server
    const productIds = [...quantities.keys()];
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res
        .status(400)
        .json({ message: "One or more products in your order no longer exist." });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const product of products) {
      const quantity = quantities.get(product._id.toString());

      if (quantity > product.stock) {
        return res
          .status(400)
          .json({ message: `Only ${product.stock} left of "${product.name}".` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
      totalPrice += product.price * quantity;
    }

    totalPrice = Math.round(totalPrice * 100) / 100;

    // 4. Save the order for the logged-in user
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        postalCode: shipping.postalCode.trim(),
      },
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Could not place the order. Please try again." });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    res.status(500).json({ message: "Could not load your orders. Please try again." });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!OBJECT_ID_PATTERN.test(id)) {
      return res.status(400).json({ message: "Invalid order id." });
    }

    // Only find the order if it belongs to the logged-in user
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error.message);
    res.status(500).json({ message: "Could not load the order. Please try again." });
  }
};
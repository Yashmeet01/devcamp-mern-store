import mongoose from "mongoose";
import Product from "../models/Product.js";

// Escapes characters like . * ( ) so a search is treated as plain text
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (typeof search === "string" && search.trim() !== "") {
      filter.name = { $regex: escapeRegex(search.trim()), $options: "i" };
    }
    if (typeof category === "string" && category.trim() !== "") {
      filter.category = category.trim();
    }

    const products = await Product.find(filter).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Could not load products. Please try again." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ message: "Could not load the product. Please try again." });
  }
};
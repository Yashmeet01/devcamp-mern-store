import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const products = [
  { name: "Ruled Notebook A4", description: "200 pages, durable cover, ideal for lecture notes.", price: 120, category: "Stationery", stock: 50, studentPick: true },
  { name: "Gel Pen Pack (10)", description: "Smooth ink gel pens in assorted colors.", price: 150, category: "Stationery", stock: 80, studentPick: true },
  { name: "Highlighter Set (5)", description: "Bright, quick-drying highlighters for revision.", price: 180, category: "Stationery", stock: 40, studentPick: false },
  { name: "Scientific Calculator", description: "Multi-line display with 240+ functions.", price: 899, category: "Electronics", stock: 25, studentPick: true },
  { name: "Wired Earphones", description: "Comfortable earphones with in-line microphone.", price: 349, category: "Electronics", stock: 60, studentPick: false },
  { name: "USB Flash Drive 64GB", description: "Compact drive for assignments and backups.", price: 499, category: "Electronics", stock: 35, studentPick: false },
  { name: "Laptop Backpack", description: "Water-resistant bag with padded laptop sleeve.", price: 1299, category: "Accessories", stock: 20, studentPick: true },
  { name: "Steel Water Bottle", description: "750 ml insulated bottle that keeps drinks cold.", price: 449, category: "Accessories", stock: 45, studentPick: false },
  { name: "Desk Lamp (LED)", description: "Adjustable LED lamp with three brightness levels.", price: 799, category: "Accessories", stock: 18, studentPick: false },
  { name: "C Programming Handbook", description: "Beginner-friendly guide with solved examples.", price: 399, category: "Books", stock: 30, studentPick: true },
  { name: "Data Structures Notes", description: "Concise chapter-wise notes with diagrams.", price: 299, category: "Books", stock: 28, studentPick: false },
  { name: "Aptitude Practice Book", description: "Practice problems for placements and exams.", price: 349, category: "Books", stock: 22, studentPick: false },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
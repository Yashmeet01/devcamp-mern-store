import bcrypt from "bcryptjs";
import User from "../models/User.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // 1. Validate the input on the server
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }
    if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // 2. Refuse duplicate emails
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // 3. Hash the password, then save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    // 4. Reply WITHOUT the password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
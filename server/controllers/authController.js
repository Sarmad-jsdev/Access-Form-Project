import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Only allow non-admin roles
  if (role === "admin") return res.status(403).json({ message: "Cannot register as admin" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  res.status(201).json({ message: "Registered successfully", user });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  res.json(req.user);
};
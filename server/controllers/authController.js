import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ BLOCK CHECK
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id }, // PAY ATTENTION TO THIS, IT'S THE USER ID, NOT THE EMAIL
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log("🔥 LOGIN ERROR FULL:", error);
    console.log("STACK:", error.stack);
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Register user

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // ✅ Trim inputs
    name = name?.trim();
    email = email?.trim().toLowerCase();

    // ✅ Required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Name validation
    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters" });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!/[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must contain 1 uppercase letter" });
    }

    if (!/[0-9]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must contain 1 number" });
    }

    // ❌ Block admin creation
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    // ✅ Default role FIX (IMPORTANT BUG)
    const allowedRoles = ["creator", "respondent"];
    if (!allowedRoles.includes(role)) {
      role = "respondent";
    }

    // ✅ Check existing email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // ✅ Generate token (optional, can be used for auto-login after registration)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registered successfully",
      token, // 🔥 ADD THIS
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

import User from "../models/User.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
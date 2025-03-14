import Jwt from "jsonwebtoken";
import User from "../models/user.model";

export const protectedRouter = async (req, res, next) => {
  try {
    const token = req.cookies.Jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token Provided" });
    }
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decoded.userid).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
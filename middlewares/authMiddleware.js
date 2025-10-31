import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      req.user = user
      next()
    } else {
      return res.status(401).json({ message: "Not authorized, no token provided" })
    }
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message)
    return res.status(401).json({ message: "Not authorized, token invalid or expired" })
  }
}

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — '${req.user.role}' role cannot perform this action`,
      })
    }

    next()
  }
}

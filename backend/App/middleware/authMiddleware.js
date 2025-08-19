const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysupersecretkey"; // 🔹 Hardcoded secret

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  console.log("🔹 Incoming Authorization Header:", authHeader);
  console.log("🔹 Token Extracted:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    console.log("🔹 Verifying token with secret:", SECRET_KEY);
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("✅ Token verified. Payload:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    console.log("❌ Access denied. User:", req.user);
    return res.status(403).json({ message: "Access denied" });
  }
  console.log("✅ Admin access granted for user:", req.user.email || req.user.id);
  next();
};

module.exports = { authMiddleware, adminOnly };

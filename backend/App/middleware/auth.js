const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔹 Incoming token:", token);

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    console.log("🔹 Verifying token with secret:", "mysupersecretkey");
    const decoded = jwt.verify(token, "mysupersecretkey");
    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

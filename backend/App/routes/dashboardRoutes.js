const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboardController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// ✅ Protect with JWT + Admin check
router.get("/summary", authMiddleware, adminOnly, getDashboardSummary);

module.exports = router;

const User = require("../models/userModel");
const Enquiry = require("../models/enquiry.model");

exports.getDashboardSummary = async (req, res) => {
  try {
    // 1️⃣ Users summary
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });

    // 2️⃣ Courses summary
    const totalCourses = await Enquiry.countDocuments();

    // 3️⃣ Last 30 days logic for "new this month"
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Count new courses with timestamps
    const newWithTimestamps = await Enquiry.countDocuments({
      createdAt: { $gte: last30Days }
    });

    // Count old courses with no createdAt
    const oldWithoutTimestamps = await Enquiry.countDocuments({
      createdAt: { $exists: false }
    });

    // ✅ Smart fallback: count old data only if new is zero
    const newCourses = newWithTimestamps > 0 
        ? newWithTimestamps 
        : oldWithoutTimestamps;

    // 4️⃣ Send the summary response
    res.json({
      totalUsers,
      admins,
      totalCourses,
      newCourses
    });

  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};

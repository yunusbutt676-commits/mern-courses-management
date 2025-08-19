const express = require("express");
const multer = require("multer");
const path = require("path");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ Named export
const {
  enquiryRead,
  enquiryShow,
  enquiryDelete,
  enquiryUpdate
} = require("../controllers/enquiryController");

const enquiryRoutes = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Admin check middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

// ✅ Public: anyone can view
enquiryRoutes.get("/viewproduct", enquiryShow);

// ✅ Admin-only: Create
enquiryRoutes.post(
  "/addproduct",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  enquiryRead
);

// ✅ Admin-only: Update
enquiryRoutes.put(
  "/updateproduct/:id",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  enquiryUpdate
);

// ✅ Admin-only: Delete
enquiryRoutes.delete(
  "/deleteproduct/:id",
  authMiddleware,
  adminOnly,
  enquiryDelete
);

module.exports = enquiryRoutes;

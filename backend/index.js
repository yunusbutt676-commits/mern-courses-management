const express = require('express');
let mongoose = require("mongoose");
let cors = require('cors');
const enquiryRoutes = require("./App/routes/enquiryRoutes");
const authRoutes = require("./App/routes/auth"); // ✅ Auth routes
const dashboardRoutes = require("./App/routes/dashboardRoutes");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Serve uploaded image files
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use('/courses', enquiryRoutes);

// ✅ Test route
app.get("/", (req, res) => {
    res.send("hi backend");
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.DBURL).then(() => {
    console.log("Connected to MONGODB");

    // ❌ Removed auto-create admin logic

    app.listen(process.env.PORT, () => {
        console.log("Server is running on PORT " + process.env.PORT)
    });
});

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");

// Securely Load MongoDB Credentials
const MONGO_URI = process.env.MONGO_URI
    .replace("<DB_USER>", process.env.DB_USER)
    .replace("<DB_PASS>", process.env.DB_PASS);

// Connect to database
connectDB(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auctions", itemRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

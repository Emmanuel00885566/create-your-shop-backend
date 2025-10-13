import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Create Your Shop Backend is running...");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/createYourShop";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

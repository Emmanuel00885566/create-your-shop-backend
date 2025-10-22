import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Create Your Shop Backend (ESM Version) is running...");
});

app.use("/api/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
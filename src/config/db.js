// config/db.js
import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("❌ MONGO_URI is not defined in .env");
    }

    await mongoose.connect(uri);

    console.log("MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectToMongoDB;

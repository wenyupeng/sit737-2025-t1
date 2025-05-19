import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mock-bank?authSource=admin';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;

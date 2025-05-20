import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const hosts = process.env.MONGO_HOSTS;
const replicaSet = process.env.MONGO_REPLICA_SET;

const MONGODB_URI = user ? `mongodb://${user}:${pass}@${hosts}/mock-bank?authSource=admin&replicaSet=${replicaSet}` || 'mongodb://admin:adminpwd@localhost:27017/mock-bank?authSource=admin';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;

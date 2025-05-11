import mongoose from 'mongoose';

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const hosts = process.env.MONGO_HOSTS;
const replicaSet = process.env.MONGO_REPLICA_SET;

const MONGODB_URI = `mongodb://${user}:${pass}@${hosts}/mock-bank?authSource=admin&replicaSet=${replicaSet}` || 'mongodb://localhost:27017/mock-bank?authSource=admin';

console.log('MONGODB_URI', MONGODB_URI);
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    (global as any).mongoose = cached;
    return cached.conn;
}

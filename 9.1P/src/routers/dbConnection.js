const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('sit737');
        console.log('Connected to MongoDB database!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
function getDB() {
    if (!db) {
        throw new Error('DB not initialized. Call connectDB() first.');
    }
    return db;
}

module.exports = { connectDB, getDB };
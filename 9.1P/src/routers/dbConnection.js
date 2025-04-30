const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const hosts = process.env.MONGO_HOSTS;
const replicaSet = process.env.MONGO_REPLICA_SET;

const uri = `mongodb://${user}:${pass}@${hosts}/?replicaSet=${replicaSet}` || 'mongodb://localhost:27017/mydatabase';

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
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
////Made for Samuel Chacon
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

let database;

const intDb = async (callback) => {
  if (database) {
    console.warn('DB is already initialized!');
    return callback(null, database);
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    database = client.db(); // Agregamos .db() para obtener la instancia correcta
    console.log("✅ MongoDB connected successfully");
    callback(null, database);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    callback(err);
  }
};

const getDatabase = () => {
  if (!database) {
    throw Error('❌ Database is not initialized');
  }
  return database;
};

module.exports = { intDb, getDatabase };

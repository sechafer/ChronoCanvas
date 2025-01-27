/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
////Made for Samuel Chacon
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

let database;

const intDb = (callback) => {
  if (database) {
    console.warn('DB is already initialized!');
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client;
    })
    .catch((err) => {
      callback(err);
    });
  return callback(null, database);
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database is not initialized');
  }
  return database;
};

module.exports = {
  intDb,
  getDatabase,
};
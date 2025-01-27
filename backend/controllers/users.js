const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getSingle = async (req, res) => {
  //#swagger.tags=['users']  
  const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId });
  res.status(200).json(result);
};

const getAll = async (req, res) => {
  //#swagger.tags=['users']  
  const result = await mongodb.getDatabase().db().collection('users').find().toArray();
  res.status(200).json(result);
};

const createUser = async (req, res) => {
    //#swagger.tags=['users']
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: new Date(req.body.birthDate),
    email: req.body.email,
    password: req.body.password
  };
  const result = await mongodb.getDatabase().db().collection('users').insertOne(newUser);
  result.acknowledged ? res.status(201).json(result) : res.status(500).json({ error: 'Failed to create user' });
};

const updateUser = async (req, res) => {
    //#swagger.tags=['users']
  const userId = new ObjectId(req.params.id);
  const updatedUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: new Date(req.body.birthDate),
    email: req.body.email,
    password: req.body.password
  };
  const result = await mongodb.getDatabase().db().collection('users').updateOne({ _id: userId }, { $set: updatedUser });
  result.modifiedCount > 0 ? res.status(200).json(result) : res.status(500).json({ error: 'Failed to update user' });
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['users']
  const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
  result.deletedCount > 0 ? res.status(200).send() : res.status(500).json({ error: 'Failed to delete user' });
};

module.exports = {
  getSingle,
  getAll,
  createUser,
  updateUser,
  deleteUser
};
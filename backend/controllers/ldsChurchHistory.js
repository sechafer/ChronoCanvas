const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getSingle = async (req, res) => {
  //#swagger.tags=['Church_History']
  const historyId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('Church_History').findOne({ _id: historyId });
  res.status(200).json(result);
};

const getAll = async (req, res) => {
  //#swagger.tags=['Church_History']
   const result = await mongodb.getDatabase().db().collection('Church_History').find().toArray();
  res.status(200).json(result);
};

const createHistory = async (req, res) => {
 //#swagger.tags=['Church_History']
    const newHistory = {
    title: req.body.title,
    description: req.body.description,
    dateRange: req.body.dateRange
  };
  const result = await mongodb.getDatabase().db().collection('Church_History').insertOne(newHistory);
  result.acknowledged ? res.status(201).json(result) : res.status(500).json({ error: 'Failed to create entry' });
};

const updateHistory = async (req, res) => {
  //#swagger.tags=['Church_History']
    const historyId = new ObjectId(req.params.id);
  const updatedHistory = {
    title: req.body.title,
    description: req.body.description,
    dateRange: req.body.dateRange
  };
  const result = await mongodb.getDatabase().db().collection('Church_History').updateOne({ _id: historyId }, { $set: updatedHistory });
  result.modifiedCount > 0 ? res.status(200).json(result) : res.status(500).json({ error: 'Failed to update entry' });
};

const deleteHistory = async (req, res) => {
  //#swagger.tags=['Church_History']
    const historyId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('Church_History').deleteOne({ _id: historyId });
  result.deletedCount > 0 ? res.status(200).send() : res.status(500).json({ error: 'Failed to delete entry' });
};

module.exports = {
  getSingle,
  getAll,
  createHistory,
  updateHistory,
  deleteHistory
};

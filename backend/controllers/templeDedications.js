const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getSingle = async (req, res) => {
  //#swagger.tags=['Temple_Dedications']  
  const templeId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('Temple_Dedications').findOne({ _id: templeId });
  res.status(200).json(result);
};

const getAll = async (req, res) => {
  //#swagger.tags=['Temple_Dedications'] 
  const result = await mongodb.getDatabase().db().collection('Temple_Dedications').find().toArray();
  res.status(200).json(result);
};

const createDedication = async (req, res) => {
//#swagger.tags=['Temple_Dedications'] 
  const newDedication = {
    temple: req.body.temple,
    dedication: req.body.dedication,
    dedicatedBy: req.body.dedicatedBy
  };
  const result = await mongodb.getDatabase().db().collection('Temple_Dedications').insertOne(newDedication);
  result.acknowledged ? res.status(201).json(result) : res.status(500).json({ error: 'Failed to create entry' });
};

const updateDedication = async (req, res) => {
  //#swagger.tags=['Temple_Dedications']   
  const templeId = new ObjectId(req.params.id);
  const updatedDedication = {
    temple: req.body.temple,
    dedication: req.body.dedication,
    dedicatedBy: req.body.dedicatedBy
  };
  const result = await mongodb.getDatabase().db().collection('Temple_Dedications').updateOne({ _id: templeId }, { $set: updatedDedication });
  result.modifiedCount > 0 ? res.status(200).json(result) : res.status(500).json({ error: 'Failed to update entry' });
};

const deleteDedication = async (req, res) => {
  //#swagger.tags=['Temple_Dedications']   
  const templeId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('Temple_Dedications').deleteOne({ _id: templeId });
  result.deletedCount > 0 ? res.status(200).send() : res.status(500).json({ error: 'Failed to delete entry' });
};

const getClosestDedication = async (req, res) => {
  try {
    // Ensure a date is provided as a query parameter
    if (!req.query.date) {
      return res.status(400).json({ error: "Date query parameter is required (format YYYY-MM-DD or MM-DD)" });
    }

    // Parse the incoming date
    const inputDate = new Date(req.query.date);
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Normalize the query date to a fixed year (e.g., 2000)
    const queryDate = new Date(2000, inputDate.getMonth(), inputDate.getDate());

    // Get all dedications from the database
    const records = await mongodb.getDatabase().db().collection('Temple_Dedications').find().toArray();

    // Process each record:
    const recordsWithDiff = records.map(record => {
      // Parse the dedication date from the record
      const dedDate = new Date(record.dedication);
      if (isNaN(dedDate.getTime())) return null; // Skip records that cannot be parsed

      // Normalize to fixed year (2000)
      const recordDate = new Date(2000, dedDate.getMonth(), dedDate.getDate());
      
      // Calculate the absolute difference in milliseconds
      const diffMs = Math.abs(recordDate - queryDate);
      const oneDayMs = 24 * 60 * 60 * 1000;
      let diffDays = diffMs / oneDayMs;
      
      // Adjust for circular difference over a 365-day cycle
      if (diffDays > 182.5) {
        diffDays = 365 - diffDays;
      }
      
      return { ...record, diffDays };
    }).filter(record => record !== null);

    if (recordsWithDiff.length === 0) {
      return res.status(404).json({ error: "No dedications available" });
    }

    // Find the record with the smallest difference
    const closestRecord = recordsWithDiff.reduce((prev, curr) =>
      curr.diffDays < prev.diffDays ? curr : prev
    );

    // Return only the fields you want: temple, dedication, and dedicatedBy
    const { temple, dedication, dedicatedBy } = closestRecord;
    res.status(200).json({ temple, dedication, dedicatedBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports = {
  getSingle,
  getAll,
  createDedication,
  updateDedication,
  deleteDedication,
  getClosestDedication
};

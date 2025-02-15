const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getSingle = async (req, res) => {
  //#swagger.tags=['LDS_Church_History']
  const historyId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('LDS_Church_History').findOne({ _id: historyId });
  res.status(200).json(result);
};

const getAll = async (req, res) => {
  //#swagger.tags=['LDS_Church_History']
   const result = await mongodb.getDatabase().db().collection('LDS_Church_History').find().toArray();
  res.status(200).json(result);
};

const createHistory = async (req, res) => {
 //#swagger.tags=['LDS_Church_History']
    const newHistory = {
    title: req.body.title,
    description: req.body.description,
    dateRange: req.body.dateRange
  };
  const result = await mongodb.getDatabase().db().collection('LDS_Church_History').insertOne(newHistory);
  result.acknowledged ? res.status(201).json(result) : res.status(500).json({ error: 'Failed to create entry' });
};

const updateHistory = async (req, res) => {
  //#swagger.tags=['LDS_Church_History']
    const historyId = new ObjectId(req.params.id);
  const updatedHistory = {
    title: req.body.title,
    description: req.body.description,
    dateRange: req.body.dateRange
  };
  const result = await mongodb.getDatabase().db().collection('LDS_Church_History').updateOne({ _id: historyId }, { $set: updatedHistory });
  result.modifiedCount > 0 ? res.status(200).json(result) : res.status(500).json({ error: 'Failed to update entry' });
};

const deleteHistory = async (req, res) => {
  //#swagger.tags=['LDS_Church_History']
    const historyId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('LDS_Church_History').deleteOne({ _id: historyId });
  result.deletedCount > 0 ? res.status(200).send() : res.status(500).json({ error: 'Failed to delete entry' });
};

const getClosestHistory = async (req, res) => {
  try {
    // Validate that a date is provided via query parameter
    if (!req.query.date) {
      return res.status(400).json({ error: "Date query parameter is required (format YYYY-MM-DD or MM-DD)" });
    }

    // Parse the incoming date
    const inputDate = new Date(req.query.date);
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Normalize the query date to a fixed year (e.g., 2000) to compare month/day only
    const queryDate = new Date(2000, inputDate.getMonth(), inputDate.getDate());

    // Fetch all historical events from the collection
    const events = await mongodb.getDatabase().db().collection('Church_History').find().toArray();

    // If no events exist in the collection, return an error
    if (!events || events.length === 0) {
      return res.status(404).json({ error: "No historical events available" });
    }

    // Calculate the circular difference (ignoring year) for each event
    let eventsWithDiff = events.map(event => {
      const eventDate = new Date(event.event_date);
      if (isNaN(eventDate.getTime())) return null; // Skip unparseable dates

      // Normalize event date to the fixed year 2000
      const normalizedEventDate = new Date(2000, eventDate.getMonth(), eventDate.getDate());
      const oneDayMs = 24 * 60 * 60 * 1000;
      let diffDays = Math.abs(normalizedEventDate - queryDate) / oneDayMs;

      // Adjust for circular difference (wrap-around of the calendar year)
      if (diffDays > 182.5) {
        diffDays = 365 - diffDays;
      }
      return { ...event, diffDays };
    }).filter(event => event !== null);

    // If for some reason all event dates were unparseable, fallback to the first event in the collection
    if (eventsWithDiff.length === 0) {
      return res.status(200).json(events[0]);
    }

    // Find the event with the smallest circular difference
    const closestHistory = eventsWithDiff.reduce((prev, curr) =>
      curr.diffDays < prev.diffDays ? curr : prev
    );

    // Return the full event object (all available information)
    return res.status(200).json(closestHistory);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getSingle,
  getAll,
  createHistory,
  updateHistory,
  deleteHistory,
  getClosestHistory
};

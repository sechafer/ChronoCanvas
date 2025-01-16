// does all of this need its own file in server.js or does it need to be in the app.js file in the frontend folder?
const express = require('express');
const connectDB = require('./db'); // Adjust the path as necessary

const app = express();

// Connect to MongoDB
connectDB();

// Other routes needed go here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
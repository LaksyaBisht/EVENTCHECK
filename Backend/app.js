const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registerEventRoutes = require('./routes/registerEventRoutes');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}));
app.use(express.json()); 


// Function to connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const users = require('./models/eventModel');
const events = require('./models/eventModel');
const registerEvents = require('./models/registerEventModel');

app.use('/api/', userRoutes);
app.use('/api/', eventRoutes);
app.use('/api/', registerEventRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});

module.exports = { users, events, registerEvents};

const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registerEventRoutes = require('./routes/registerEventRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./lib/db');

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}));
app.use(express.json()); 


const users = require('./models/eventModel');
const events = require('./models/eventModel');
const registerEvents = require('./models/registerEventModel');

app.use('/api/', userRoutes);
app.use('/api/', eventRoutes);
app.use('/api/', registerEventRoutes);
app.use('/api/', aiRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  connectDB();
});

module.exports = { users, events, registerEvents};

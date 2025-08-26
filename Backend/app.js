import express from 'express';
import cors from 'cors';
const app = express();
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registerEventRoutes from './routes/registerEventRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './lib/db.js';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/', userRoutes);
app.use('/api/', eventRoutes);
app.use('/api/', registerEventRoutes);
app.use('/api/', aiRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  connectDB();
});
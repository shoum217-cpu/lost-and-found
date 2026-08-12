import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();

// Attempt to connect to DB, but don't crash if MONGO_URI is missing (for initial scaffolding)
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('ReFound API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

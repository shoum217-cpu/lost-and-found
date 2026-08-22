import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import heatmapRoutes from './routes/heatmapRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

// Attempt to connect to DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/heatmap', heatmapRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'FindIt API',
    version: '2.0.0',
    status: 'online',
    description: 'Intelligent Lost & Found Platform API',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FindIt Backend server running on port ${PORT}`);
});

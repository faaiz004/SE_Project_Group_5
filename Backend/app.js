// app.js

// 1. Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// 2. Core imports
import express from 'express';
import cors from 'cors';


const app = express();


// 3. Database connection

app.use(cors({
  origin: '*', // or 'http://localhost:3000' for React frontend
  credentials: true
}));

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// 4. Routes
import uploadRoutes from './routes/upload.js';
import postRoutes from './routes/posts.js';
import cartRoutes from './routes/cart.js';
import userRoutes from './routes/user.js';
import clothesRoutes from './routes/clothes.js';

import googleAuthRoutes from './routes/googleAuth.js';

app.use('/api', uploadRoutes);
app.use('/api', postRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/clothes', clothesRoutes);


// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API 👋' });
});

// 5. 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// 6. Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  console.error(`[${status}] ${message}`);
  res.status(status).json({ error: message });
});

// 8. Export app
export default app;

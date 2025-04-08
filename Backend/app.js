// app.js

// 1. Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// 2. Core imports
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

<<<<<<< HEAD
// 3. Database connection

app.use(cors({
  origin: '*', // or 'http://localhost:3000' for React frontend
  credentials: true
}));
=======
// 3. Middleware (ORDER MATTERS!)
app.use(cors()); // Enable CORS first
>>>>>>> 8db15d8 (post backend)
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// 4. Routes
import uploadRoutes from './routes/upload.js';
import postRoutes from './routes/posts.js';
import cartRoutes from './routes/cart.js';
<<<<<<< HEAD
import authRoutes from './routes/user.js';
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
=======
import googleAuthRoutes from './routes/googleAuth.js';

app.use('/api', uploadRoutes);
app.use('/api', postRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", googleAuthRoutes);
>>>>>>> 8db15d8 (post backend)

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

// 7. Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(8001, () => console.log("Server running on http://localhost:8001"));
  })
  .catch(err => console.error(err));

// 8. Export app
export default app;

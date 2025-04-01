// app.js

// 1. Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// 2. Core imports
import express from 'express';
import cors from 'cors';
const app = express();

// 3. Basic middleware (ORDER MATTERS!)
app.use(cors()); // Enable CORS first
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// 4. Routes
import cartRoutes from './routes/cart.js';
app.use('/api/cart', cartRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API 👋' });
});

// 5. Placeholder for user routes
// import userRoutes from './routes/users.js';
// app.use('/users', userRoutes);

// 6. 404 handler (MUST BE AFTER ALL ROUTES)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// 7. Global error handler (MUST BE LAST)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    console.error(`[${status}] ${message}`);
    res.status(status).json({ error: message });
});

// 8. Export app
export default app;
import dotenv from 'dotenv';
dotenv.config();

// 2. Core imports
import express from 'express';
import cors from 'cors';


const app = express();


// 3. Database connection

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// 4. Routes
import postRoutes from './routes/clothes.js';
import userRoutes from './routes/user.js';
import clothesRoutes from './routes/clothes.js';
import postsRoutes from './routes/posts.js';
import googleAuthRoutes from './routes/googleAuth.js';
import textureRoutes from './routes/textures.js';


app.use('/api', postRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/textures', textureRoutes);





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

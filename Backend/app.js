import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import cors from 'cors';


const app = express();


app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


import postRoutes from './routes/clothes.js';
import userRoutes from './routes/user.js';
import clothesRoutes from './routes/clothes.js';
import postsRoutes from './routes/posts.js';
import googleAuthRoutes from './routes/googleAuth.js';
import textureRoutes from './routes/textures.js';
import checkoutRoutes from './routes/checkout.js';

app.use('/api', postRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/textures', textureRoutes);
app.use('/api/checkout', checkoutRoutes);






app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API 👋' });
});


app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  console.error(`[${status}] ${message}`);
  res.status(status).json({ error: message });
});


export default app;

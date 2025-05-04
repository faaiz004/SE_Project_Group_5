// server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';



const PORT = process.env.PORT || 8000;
connectDB(); 


app.listen(PORT, () => {
});


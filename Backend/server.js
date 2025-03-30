// server.js

import app from './app.js';
import connectDB from './config/db.js';


const PORT = process.env.PORT || 8000;
connectDB(); // Connect to MongoDB


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


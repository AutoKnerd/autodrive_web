import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sprocketRoute from './sprocket-route.js';

// Load environment variables from .env into process.env.
dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS so browser-based frontends can call this API.
app.use(cors());

// Parse incoming JSON request bodies.
app.use(express.json());

// Mount all API routes under /api.
app.use('/api', sprocketRoute);

// Basic health route for quick local checks.
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'sprocket-backend' });
});

// Global fallback error handler.
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ reply: 'Sprocket had a gear slip. Try again in a moment.' });
});

// Start the backend server on port 3000.
app.listen(PORT, () => {
  console.log(`Sprocket API running at http://localhost:${PORT}`);
});

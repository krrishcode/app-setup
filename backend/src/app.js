const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// ─── Security Middleware ────────────────────────────────────────
app.use(helmet());

// ─── CORS Configuration ────────────────────────────────────────
app.use(cors({
  origin: '*', // In production, replace with your app's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logging ────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── API Routes ─────────────────────────────────────────────────
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);

// ─── Error Handling ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;

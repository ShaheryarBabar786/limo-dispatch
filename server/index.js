require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const fleetRoutes = require('./routes/fleet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/fleet', fleetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test Supabase connection
app.get('/api/test-db', async (req, res) => {
  try {
    const supabase = require('./config/supabase');
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message 
      });
    }

    res.json({ 
      message: 'Database connection successful',
      data 
    });
  } catch (err) {
    console.error('Test DB error:', err);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: err.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Limo Dispatch API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      health: '/api/health'
    }
  });
});

// 404 handler - FIXED: Use a proper path pattern
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚗 Car Booking Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test DB: http://localhost:${PORT}/api/test-db`);
});
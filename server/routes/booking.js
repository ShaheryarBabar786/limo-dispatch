const express = require('express');
const { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBookingStatus, 
  deleteBooking 
} = require('../controllers/bookingController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', createBooking);
router.get('/:id', getBookingById);

// Admin protected routes
router.get('/', authenticateToken, isAdmin, getBookings);
router.patch('/:id/status', authenticateToken, isAdmin, updateBookingStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteBooking);

module.exports = router;
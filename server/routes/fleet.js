const express = require('express');
const { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  toggleVehicleStatus
} = require('../controllers/fleetController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes (for customer fleet page)
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Admin protected routes
router.post('/', authenticateToken, isAdmin, createVehicle);
router.put('/:id', authenticateToken, isAdmin, updateVehicle);
router.patch('/:id/status', authenticateToken, isAdmin, toggleVehicleStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteVehicle);

module.exports = router;
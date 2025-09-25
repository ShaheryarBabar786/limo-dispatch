const supabase = require('../config/supabase');

// GET ALL VEHICLES
const getVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, active } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by vehicle type
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    // Filter by active status
    if (active !== undefined) {
      query = query.eq('is_active', active === 'true');
    }

    // Add pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: vehicles, error, count } = await query;

    if (error) {
      console.error('Supabase error (get vehicles):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      message: 'Vehicles retrieved successfully',
      vehicles: vehicles || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET SINGLE VEHICLE
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error (get vehicle):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({
      message: 'Vehicle retrieved successfully',
      vehicle
    });

  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE VEHICLE
const createVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      image_url,
      base_price,
      capacity,
      luggage_capacity,
      transfer_types,
      description,
      features,
      is_active = true
    } = req.body;

    // Validate required fields
    if (!name || !type || !base_price || !capacity || !luggage_capacity || !description) {
      return res.status(400).json({ 
        error: 'Name, type, base_price, capacity, luggage_capacity, and description are required' 
      });
    }

    // Validate numeric fields
    if (base_price < 0 || capacity <= 0 || luggage_capacity < 0) {
      return res.status(400).json({ 
        error: 'Invalid numeric values. Base price must be >= 0, capacity > 0, luggage_capacity >= 0' 
      });
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([
        {
          name,
          type,
          image_url: image_url || '',
          base_price,
          capacity,
          luggage_capacity,
          transfer_types: transfer_types || [],
          description,
          features: features || [],
          is_active: is_active !== false
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error (create vehicle):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle: data
    });

  } catch (error) {
    console.error('Vehicle creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE VEHICLE
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      image_url,
      base_price,
      capacity,
      luggage_capacity,
      transfer_types,
      description,
      features,
      is_active
    } = req.body;

    // Check if vehicle exists
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const updateData = {
      name: name || existingVehicle.name,
      type: type || existingVehicle.type,
      image_url: image_url !== undefined ? image_url : existingVehicle.image_url,
      base_price: base_price !== undefined ? base_price : existingVehicle.base_price,
      capacity: capacity !== undefined ? capacity : existingVehicle.capacity,
      luggage_capacity: luggage_capacity !== undefined ? luggage_capacity : existingVehicle.luggage_capacity,
      transfer_types: transfer_types !== undefined ? transfer_types : existingVehicle.transfer_types,
      description: description || existingVehicle.description,
      features: features !== undefined ? features : existingVehicle.features,
      is_active: is_active !== undefined ? is_active : existingVehicle.is_active,
      updated_at: new Date().toISOString()
    };

    // Validate numeric fields
    if (updateData.base_price < 0 || updateData.capacity <= 0 || updateData.luggage_capacity < 0) {
      return res.status(400).json({ 
        error: 'Invalid numeric values. Base price must be >= 0, capacity > 0, luggage_capacity >= 0' 
      });
    }

    const { data, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error (update vehicle):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      message: 'Vehicle updated successfully',
      vehicle: data
    });

  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE VEHICLE
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle exists
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error (delete vehicle):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Vehicle deleted successfully' });

  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// TOGGLE VEHICLE STATUS
const toggleVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle exists
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const { data, error } = await supabase
      .from('vehicles')
      .update({ 
        is_active: !existingVehicle.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error (toggle vehicle status):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      message: `Vehicle ${data.is_active ? 'activated' : 'deactivated'} successfully`,
      vehicle: data
    });

  } catch (error) {
    console.error('Toggle vehicle status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  toggleVehicleStatus
};
const supabase = require('../config/supabase');
const { validateBooking, validateStatus } = require('../utils/validation');

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      pickup_address,
      destination_address,
      pickup_date,
      pickup_time,
      vehicle_type,
      passengers,
      special_requests,
      total_price
    } = req.body;

    // Validate required fields
    if (!customer_name || !customer_email || !pickup_address || !destination_address || !pickup_date || !pickup_time) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate booking data
    const validationErrors = validateBooking(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_name,
          customer_email,
          customer_phone,
          pickup_address,
          destination_address,
          pickup_date,
          pickup_time,
          vehicle_type: vehicle_type || 'standard',
          passengers: passengers || 1,
          special_requests: special_requests || '',
          total_price: total_price || 0,
          status: 'pending'
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error (create booking):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: data
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET ALL BOOKINGS (with pagination and filtering)
const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search by customer name or email
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    // Add pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Supabase error (get bookings):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      message: 'Bookings retrieved successfully',
      bookings: bookings || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET SINGLE BOOKING
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error (get booking):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking retrieved successfully',
      booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (!validateStatus(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error (update booking):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking: data
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error (delete booking):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Booking deleted successfully' });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBookingStatus, 
  deleteBooking 
};
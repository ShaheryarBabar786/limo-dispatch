const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  const validateBooking = (booking) => {
    const errors = [];
    
    if (!booking.customer_name || booking.customer_name.trim().length < 2) {
      errors.push('Customer name is required and must be at least 2 characters');
    }
    
    if (!validateEmail(booking.customer_email)) {
      errors.push('Valid email is required');
    }
    
    if (booking.customer_phone && !validatePhone(booking.customer_phone)) {
      errors.push('Valid phone number is required');
    }
    
    if (!booking.pickup_address || booking.pickup_address.trim().length < 5) {
      errors.push('Valid pickup address is required');
    }
    
    if (!booking.destination_address || booking.destination_address.trim().length < 5) {
      errors.push('Valid destination address is required');
    }
    
    if (!booking.pickup_date) {
      errors.push('Pickup date is required');
    }
    
    if (!booking.pickup_time) {
      errors.push('Pickup time is required');
    }
    
    if (booking.passengers && (booking.passengers < 1 || booking.passengers > 20)) {
      errors.push('Passengers must be between 1 and 20');
    }
    
    if (booking.total_price && booking.total_price < 0) {
      errors.push('Total price cannot be negative');
    }
    
    return errors;
  };
  
  const validateUser = (user) => {
    const errors = [];
    
    if (!validateEmail(user.email)) {
      errors.push('Valid email is required');
    }
    
    if (!user.password || user.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (!user.name || user.name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters');
    }
    
    return errors;
  };
  
  const validateStatus = (status) => {
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    return validStatuses.includes(status);
  };
  
  module.exports = {
    validateEmail,
    validatePhone,
    validateBooking,
    validateUser,
    validateStatus
  };
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";
import { Calendar, Clock, MapPin, Navigation, Car, Search, CheckCircle, Users, Luggage } from "lucide-react";
import MapComponent from "./MapComponent";
import { fleetAPI, bookingAPI } from "@/services/api";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  image_url: string;
  base_price: number;
  capacity: number;
  luggage_capacity: number;
  transfer_types: string[];
  description: string;
  features: string[];
  is_active: boolean;
}

const BookingStep = ({ number, title, active = false, completed = false }) => (
  <div className="flex items-center mb-8">
    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
      completed 
        ? 'bg-green-600 text-white' 
        : active 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-700 text-gray-300'
    }`}>
      {completed ? '✓' : number}
    </div>
    <div className="ml-4">
      <h3 className={`text-lg font-medium ${
        active || completed ? 'text-white' : 'text-gray-400'
      }`}>
        {title}
      </h3>
    </div>
  </div>
);

export const PricingSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    transferType: 'one-way',
    waitingHours: 'no-waiting',
    passengers: 1,
    carType: 'all',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });

  // Load all vehicles on component mount
  useEffect(() => {
    loadAllVehicles();
  }, []);

  const loadAllVehicles = async () => {
    try {
      const response = await fleetAPI.getAll({ active: true });
      setAllVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    
    try {
      // Filter vehicles based on capacity and transfer type
      const filteredVehicles = allVehicles.filter(vehicle => {
        const hasCapacity = vehicle.capacity >= parseInt(formData.passengers.toString());
        const supportsTransfer = vehicle.transfer_types.includes(formData.transferType);
        const matchesType = formData.carType === 'all' || vehicle.type === formData.carType;
        
        return hasCapacity && supportsTransfer && matchesType;
      });
      
      setAvailableVehicles(filteredVehicles);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      setBookingError('Failed to search vehicles. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Calculate price based on transfer type
  const calculatePrice = (vehicle: Vehicle) => {
    let price = vehicle.base_price;
    
    if (formData.transferType === "round-trip") {
      price = price * 1.8;
    } else if (formData.transferType === "hourly") {
      price = price * 2;
    }
    
    // Add waiting time cost
    if (formData.waitingHours !== 'no-waiting') {
      const waitingMultipliers = {
        '30-min': 1.2,
        '1-hour': 1.4,
        '2-hours': 1.8,
        '3-hours': 2.2
      };
      price = price * waitingMultipliers[formData.waitingHours];
    }
    
    return Math.round(price);
  };

  const handleBookingSubmit = async () => {
    if (!selectedVehicle || !formData.customerName || !formData.customerEmail) {
      setBookingError("Please fill in all required customer details");
      return;
    }

    setLoading(true);
    setBookingError("");

    try {
      const bookingData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        pickup_address: formData.pickupLocation,
        destination_address: formData.dropoffLocation,
        pickup_date: formData.pickupDate,
        pickup_time: formData.pickupTime,
        vehicle_type: selectedVehicle.type,
        vehicle_id: selectedVehicle.id,
        passengers: parseInt(formData.passengers.toString()),
        special_requests: formData.specialRequests,
        total_price: calculatePrice(selectedVehicle),
        transfer_type: formData.transferType,
        waiting_hours: formData.waitingHours
      };

      const response = await bookingAPI.create(bookingData);
      
      if (response.data) {
        setBookingSuccess(true);
        setCurrentStep(3);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      setBookingError(error.response?.data?.error || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pickupDate: '',
      pickupTime: '',
      pickupLocation: '',
      dropoffLocation: '',
      transferType: 'one-way',
      waitingHours: 'no-waiting',
      passengers: 1,
      carType: 'all',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      specialRequests: ''
    });
    setSelectedVehicle(null);
    setAvailableVehicles([]);
    setBookingSuccess(false);
    setBookingError("");
    setCurrentStep(1);
  };

  return (
    <section className="container px-4 py-24">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-8 text-white"
        >
          BOOK YOUR <span className="text-green-500">LUXURY RIDE</span> HERE
        </motion.h2>

        <div className="flex justify-center space-x-8 md:space-x-16 mb-12">
          <BookingStep 
            number={1} 
            title="Enter Ride Details" 
            active={currentStep === 1} 
            completed={currentStep > 1}
          />
          <BookingStep 
            number={2} 
            title="Choose Vehicle & Details" 
            active={currentStep === 2} 
            completed={currentStep > 2}
          />
          <BookingStep 
            number={3} 
            title="Confirmation" 
            active={currentStep === 3} 
            completed={currentStep > 3}
          />
        </div>
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-5">
            <CardSpotlight className="border-white/10 border-2 p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Pickup Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="Enter Pick-Up Location"
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Drop-off Location */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Navigation className="w-4 h-4 mr-2" />
                    Drop-Off Location
                  </label>
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    placeholder="Enter Drop-Off Location"
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Number of Passengers */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Users className="w-4 h-4 mr-2" />
                    Number of Passengers
                  </label>
                  <input
                    type="number"
                    name="passengers"
                    min="1"
                    max="20"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Transfer Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Car className="w-4 h-4 mr-2" />
                    Transfer Type
                  </label>
                  <select
                    name="transferType"
                    value={formData.transferType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                  >
                    <option value="one-way">One Way</option>
                    <option value="round-trip">Round Trip</option>
                    <option value="hourly">Hourly Charter</option>
                  </select>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Car className="w-4 h-4 mr-2" />
                    Vehicle Type
                  </label>
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                  >
                    <option value="all">All Vehicle Types</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="limousine">Limousine</option>
                    
                  </select>
                </div>

                {/* Extra Waiting Hours */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Extra Waiting Hours
                  </label>
                  <select
                    name="waitingHours"
                    value={formData.waitingHours}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
                  >
                    <option value="no-waiting">No Waiting</option>
                    <option value="30-min">30 Minutes</option>
                    <option value="1-hour">1 Hour</option>
                    <option value="2-hours">2 Hours</option>
                    <option value="3-hours">3+ Hours</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  disabled={searchLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold disabled:opacity-50"
                >
                  {searchLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Available Vehicles
                    </>
                  )}
                </Button>
              </form>
            </CardSpotlight>
          </div>

          <div className="lg:col-span-7">
            <CardSpotlight className="border-white/10 border-2 h-full">
              <div className="p-1 h-full">
                <MapComponent 
                  pickupLocation={formData.pickupLocation}
                  dropoffLocation={formData.dropoffLocation}
                />
              </div>
            </CardSpotlight>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-6xl mx-auto">
          <CardSpotlight className="border-white/10 border-2 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Select Your Vehicle ({availableVehicles.length} available)
            </h3>
            
            {availableVehicles.length === 0 ? (
              <div className="text-center py-8">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No vehicles available for your criteria</p>
                <Button onClick={() => setCurrentStep(1)}>
                  Adjust Search Criteria
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {availableVehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id}
                      className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition ${
                        selectedVehicle?.id === vehicle.id ? "border-2 border-green-500" : "hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="h-32 bg-gray-700 rounded mb-4 flex items-center justify-center">
                        <img 
                          src={vehicle.image_url || "/lovable-uploads/hero-home.jpg"} 
                          alt={vehicle.name}
                          className="h-full w-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/lovable-uploads/hero-home.jpg';
                          }}
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{vehicle.name}</h4>
                      <p className="text-gray-400 text-sm mb-2">{vehicle.description}</p>
                      <div className="flex items-center text-sm text-gray-400 mb-1">
                        <Users className="w-4 h-4 mr-1" />
                        {vehicle.capacity} passengers
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <Luggage className="w-4 h-4 mr-1" />
                        {vehicle.luggage_capacity} luggage
                      </div>
                      <p className="text-green-500 font-bold text-xl">
                        ${calculatePrice(vehicle)}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedVehicle && (
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-bold text-white mb-4">Customer Details</h4>
                    {bookingError && (
                      <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                        {bookingError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-700 rounded-lg px-4 py-2 text-black focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          className="w-full border border-gray-700 rounded-lg px-4 py-2 text-black focus:border-green-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-700 rounded-lg px-4 py-2 text-black focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Special Requests
                        </label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full border border-gray-700 rounded-lg px-4 py-2 text-black focus:border-green-500 focus:outline-none"
                          placeholder="Any special requirements..."
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                      <h5 className="font-semibold text-white mb-2">Booking Summary</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-400">Vehicle:</div>
                        <div className="text-white">{selectedVehicle.name}</div>
                        
                        <div className="text-gray-400">Price:</div>
                        <div className="text-green-500 font-bold">${calculatePrice(selectedVehicle)}</div>
                        
                        <div className="text-gray-400">Pickup:</div>
                        <div className="text-white">{formData.pickupLocation}</div>
                        
                        <div className="text-gray-400">Destination:</div>
                        <div className="text-white">{formData.dropoffLocation}</div>
                        
                        <div className="text-gray-400">Transfer Type:</div>
                        <div className="text-white capitalize">{formData.transferType.replace('-', ' ')}</div>
                        
                        <div className="text-gray-400">Passengers:</div>
                        <div className="text-white">{formData.passengers}</div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBookingSubmit}
                      disabled={loading || !formData.customerName || !formData.customerEmail}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardSpotlight>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto text-center">
          <CardSpotlight className="border-white/10 border-2 p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h3>
            <p className="text-gray-300 mb-4">
              Thank you for your booking! We have received your request and will contact you shortly to confirm the details.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left">
              <h5 className="font-semibold text-white mb-2">Booking Details:</h5>
              <p className="text-gray-300 text-sm">Vehicle: {selectedVehicle?.name}</p>
              <p className="text-gray-300 text-sm">Total: ${selectedVehicle ? calculatePrice(selectedVehicle) : 0}</p>
              <p className="text-gray-300 text-sm">
                A confirmation email has been sent to {formData.customerEmail}
              </p>
            </div>
            <Button 
              onClick={resetForm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Make Another Booking
            </Button>
          </CardSpotlight>
        </div>
      )}
    </section>
  );
};
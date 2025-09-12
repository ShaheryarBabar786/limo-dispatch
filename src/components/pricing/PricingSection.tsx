import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";
import { Calendar, Clock, MapPin, Navigation, Car, Search, CheckCircle, Copy, MessageCircle, Users, Luggage } from "lucide-react";
import MapComponent from "./MapComponent";
import { fleetData } from "../../data/fleetData"; // Import the fleet data

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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [copied, setCopied] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    transferType: 'one-way',
    waitingHours: 'no-waiting',
    passengers: 1,
    carType: 'all'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter vehicles based on capacity and transfer type
    const filteredVehicles = fleetData.filter(vehicle => {
      const hasCapacity = vehicle.capacity >= parseInt(formData.passengers.toString());
      const supportsTransfer = vehicle.transferTypes.includes(formData.transferType);
      const matchesType = formData.carType === 'all' || vehicle.type === formData.carType;
      
      return hasCapacity && supportsTransfer && matchesType;
    });
    
    setAvailableVehicles(filteredVehicles);
    setCurrentStep(2);
  };

  // Calculate price based on transfer type
  const calculatePrice = (vehicle) => {
    let price = vehicle.basePrice;
    
    if (formData.transferType === "round-trip") {
      price = price * 1.8; // 80% increase for round trip
    } else if (formData.transferType === "hourly") {
      price = price * 2; // Hourly rate is double the base
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
    
    return price;
  };

  // Format the booking details message
  const formatBookingMessage = () => {
    const price = selectedVehicle ? calculatePrice(selectedVehicle) : 'N/A';
    
    return `*NEW BOOKING REQUEST*%0A%0A` +
           `*Pickup Details:*%0A` +
           `📅 Date: ${formData.pickupDate}%0A` +
           `⏰ Time: ${formData.pickupTime}%0A` +
           `📍 Location: ${formData.pickupLocation}%0A%0A` +
           `*Drop-off Details:*%0A` +
           `🎯 Location: ${formData.dropoffLocation}%0A%0A` +
           `*Service Details:*%0A` +
           `👥 Passengers: ${formData.passengers}%0A` +
           `🚗 Transfer Type: ${formData.transferType}%0A` +
           `⏳ Waiting Time: ${formData.waitingHours}%0A` +
           `🚙 Vehicle: ${selectedVehicle?.name || 'Not selected'}%0A` +
           `💰 Estimated Price: $${price}%0A%0A` +
           `*PLEASE CONFIRM THIS BOOKING*`;
  };

  // Function to open WhatsApp with pre-filled message
  const openWhatsApp = () => {
    const message = formatBookingMessage();
    const whatsappGroupLink = "https://chat.whatsapp.com/J7OcPS70iBwEsxHlbdO30Z";
    window.open(`${whatsappGroupLink}?text=${message}`, '_blank');
    setCurrentStep(3);
  };

  // Function to copy message to clipboard
  const copyToClipboard = () => {
    const message = formatBookingMessage()
      .replace(/%0A/g, '\n')
      .replace(/\*/g, '');
    
    navigator.clipboard.writeText(message)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
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
            title="Choose a vehicle" 
            active={currentStep === 2} 
            completed={currentStep > 2}
          />
          <BookingStep 
            number={3} 
            title="Place Order" 
            active={currentStep === 3} 
            completed={currentStep > 3}
          />
        </div>
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Booking Form */}
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
                    className="w-full  border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
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
                    className="w-full  border border-gray-700 rounded-lg px-4 py-3 text-black focus:border-green-500 focus:outline-none"
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
                  className="w-full hover:bg-green-700 text-white py-3 text-base font-semibold"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Available Vehicles
                </Button>
              </form>
            </CardSpotlight>
          </div>

          {/* Right Column - Map */}
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
        <div className="max-w-4xl mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {availableVehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id}
                      className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition ${
                        selectedVehicle?.id === vehicle.id ? "border-2 border-green-500" : "hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="h-40 bg-gray-700 rounded mb-4 flex items-center justify-center">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{vehicle.name}</h4>
                      <p className="text-gray-400 mb-2">{vehicle.description}</p>
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <Users className="w-4 h-4 mr-1" />
                        {vehicle.capacity} passengers
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <Luggage className="w-4 h-4 mr-1" />
                        {vehicle.luggage} luggage
                      </div>
                      <div className="mb-2">
                        <h5 className="text-sm font-semibold text-gray-400 mb-1">Features:</h5>
                        <ul className="text-xs text-gray-400">
                          {vehicle.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-green-500 font-bold text-xl">
                        ${calculatePrice(vehicle)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={openWhatsApp}
                  disabled={!selectedVehicle}
                  className="w-full hover:bg-green-700 text-white py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Open WhatsApp to Send Booking
                </Button>
                
                <div className="text-center">
                  <button 
                    onClick={copyToClipboard}
                    className="text-sm text-gray-400 hover:text-green-400 flex items-center justify-center mx-auto"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? "Copied to clipboard!" : "Copy message instead"}
                  </button>
                </div>
              </>
            )}
          </CardSpotlight>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto text-center">
          <CardSpotlight className="border-white/10 border-2 p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Booking Request Ready!</h3>
            <p className="text-gray-300 mb-4">
              Your booking details have been prepared. Please make sure to:
            </p>
            <ol className="text-left text-gray-300 mb-6 list-decimal pl-5 space-y-2">
              <li>Open WhatsApp if it didn't open automatically</li>
              <li>Check that the message is correctly filled out</li>
              <li>Press the send button to submit your booking request</li>
            </ol>
            <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left">
              <p className="text-gray-300 text-sm mb-2">If you didn't get redirected to WhatsApp:</p>
              <div className="flex space-x-2">
                <Button 
                  onClick={openWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open WhatsApp Again
                </Button>
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </Button>
              </div>
            </div>
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setSelectedVehicle(null);
                setFormData({
                  pickupDate: '',
                  pickupTime: '',
                  pickupLocation: '',
                  dropoffLocation: '',
                  transferType: 'one-way',
                  waitingHours: 'no-waiting',
                  passengers: 1,
                  carType: 'all'
                });
              }}
              className="hover:bg-green-700 text-white"
            >
              Make Another Booking
            </Button>
          </CardSpotlight>
        </div>
      )}
    </section>
  );
};
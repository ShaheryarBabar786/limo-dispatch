import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";
import { Calendar, Clock, MapPin, Navigation, Car, Search } from "lucide-react";
import MapComponent from "./MapComponent"; 

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
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    transferType: 'one-way',
    waitingHours: 'no-waiting'
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
    // Handle form submission here
    console.log('Form data:', formData);
    setCurrentStep(2);
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

      <div className=" lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="one-way">One Way</option>
                  <option value="round-trip">Round Trip</option>
                  <option value="hourly">Hourly Charter</option>
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
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
    </section>
  );
};
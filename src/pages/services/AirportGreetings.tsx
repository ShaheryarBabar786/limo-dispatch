import { motion } from "framer-motion";
import { Plane, Clock, Users, Luggage, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

const AirportGreetings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flightNumber: "",
    airport: "",
    date: "",
    time: "",
    passengers: "",
    serviceType: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const services = [
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Arrivals",
      description: "Greeters assist clients throughout the arrival process, from the plane to your chauffeur"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Avoid the Lines",
      description: "Private check-in for departing flights*, and priority boarding and carry-on luggage assistance"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cart Service",
      description: "Speedy cart service ushering you through terminals to your gate, or to baggage claim"
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Departures",
      description: "Waiting curbsite for your arrival, your Greeter assists you throughout the departure process"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Customs",
      description: "Greeters assist you through fast track process for passport control and customs clearance"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Independent Service",
      description: "Greeter service can be booked as a stand-alone addition to traveling"
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Connections",
      description: "Also available for connecting flights, a Greeter will meet you as you exit the skyway"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Groups",
      description: "Whether you are a group of one or several, our concierge services make traveling easier"
    },
    {
      icon: <Luggage className="w-8 h-8" />,
      title: "Porter service",
      description: "One bag or lots of them, let our luggage porters worry about getting those heavy things"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative px-4 pt-32 pb-20 min-h-[40vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url("/lovable-uploads/hero-home.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Airport Greetings
          </h1>
          <p className="text-xl text-gray-200">
            Stress-free travel through airports around the world
          </p>
        </div>
      </motion.section>

      {/* Intro Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-gray-300 text-lg leading-relaxed">
              We understand every minute counts. Whether you're traveling with the family, or working up to the last second, 
              time is a precious commodity you can't afford to waste standing in long security lines or navigating the airport.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Through our VIP Airport Greeters Program, we provide expedited transit and other benefits that eliminate 
              unnecessary stress for travel through over 450 airports and destinations around the world.
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Like having your own personal travel assistant
          </h2>
          <p className="text-gray-400 text-center mb-16">
            Many services that save you time, and provide peace of mind
          </p>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10 text-center"
              >
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Note Section */}
          <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10 text-center mb-16">
            <p className="text-gray-400 italic">
              *SERVICES AND CAPABILITIES MAY VARY BETWEEN AIRPORTS, CONTACT OUR RESERVATIONS TEAM FOR MORE DETAILS
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              A service you can't afford to travel without
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {["business team", "families", "making short flight connections", "leisure", "corporate", "VIP clients", "international travelers", "group travel"].map((item) => (
                <div key={item} className="bg-[#0A0A0A] p-4 rounded-lg border border-white/10">
                  <span className="text-white text-sm capitalize">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
              Book Airport Greeting Service
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-[#0A0A0A] p-8 rounded-xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Flight Number</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Airport</label>
                  <input
                    type="text"
                    name="airport"
                    value={formData.airport}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Passengers</label>
                  <input
                    type="number"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  >
                    <option value="">Select Service Type</option>
                    <option value="arrival">Arrival Service</option>
                    <option value="departure">Departure Service</option>
                    <option value="connection">Connection Service</option>
                    <option value="full">Full Service (Arrival + Departure)</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors resize-none"
                  placeholder="Any special requirements or additional information"
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                Book Service
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AirportGreetings;
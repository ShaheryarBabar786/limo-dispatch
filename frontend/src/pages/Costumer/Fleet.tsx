import { motion } from "framer-motion";
import { Car, Users, Luggage, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { fleetData } from "../../../src/data/fleetData";

const Fleet = () => {
  const transformedFleetData = fleetData.map(vehicle => ({
    ...vehicle,
    price: `$${vehicle.basePrice} / per hour`,
  }));

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
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Our Fleet
          </h1>
          <p className="text-xl text-gray-200">
            Premium vehicles for every occasion
          </p>
        </div>
      </motion.section>

      {/* Fleet Grid Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Premium Fleet Options</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from our selection of luxury vehicles for any occasion in New York City
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {transformedFleetData.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 hover:border-green-600/30 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    PREMIUM
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
                    <p className="text-green-400 font-bold text-lg">{vehicle.price}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-gray-300 text-sm">Capacity: {vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-gray-300 text-sm">Luggage: {vehicle.luggage}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {vehicle.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                      Features
                    </h4>
                    <ul className="space-y-1">
                      {vehicle.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 flex items-center text-xs">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Book This Vehicle
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto text-center">
          <div className="bg-[#0A0A0A] rounded-2xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              We have access to a wide range of luxury vehicles. Contact us for special requests or larger group transportation needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Contact Us
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Call Now: +1 (888) 711-5065
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Service Areas
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Enjoy premium chauffeured transportation across New York, New Jersey, Manhattan, Long Island, Newark, and beyond.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {["New York", "New Jersey", "Manhattan", "Long Island", "Newark", "Brooklyn", "Queens", "Staten Island"].map((area) => (
              <div key={area} className="bg-[#0A0A0A] p-4 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-white text-sm">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-black">
        <Footer />
      </div>
    </div>
  );
};

export default Fleet;
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureTab } from "./FeatureTab";
import { FeatureContent } from "./FeatureContent";
import { features } from "@/config/features";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Car data for the carousel
const carData = [
  {
    id: 1,
    name: "Mercedes S-Class",
    image: "/cars/mercedes-s-class.jpg",
    price: "$199/hour",
    features: ["Luxury Interior", "Chauffeur Included", "Complementary Water"]
  },
  {
    id: 2,
    name: "BMW 7 Series",
    image: "/cars/bmw-7-series.jpg",
    price: "$189/hour",
    features: ["Spacious Cabin", "Premium Sound System", "WiFi Enabled"]
  },
  {
    id: 3,
    name: "Lincoln Stretch Limousine",
    image: "/cars/lincoln-limousine.jpg",
    price: "$249/hour",
    features: ["8 Passenger Capacity", "LED Lighting", "Refreshment Bar"]
  },
  {
    id: 4,
    name: "Cadillac Escalade",
    image: "/cars/cadillac-escalade.jpg",
    price: "$179/hour",
    features: ["7 Seats", "All-Wheel Drive", "Entertainment System"]
  }
];

export const FeaturesSection = () => {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  const nextCar = () => {
    setCurrentCarIndex((prevIndex) => 
      prevIndex === carData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCar = () => {
    setCurrentCarIndex((prevIndex) => 
      prevIndex === 0 ? carData.length - 1 : prevIndex - 1
    );
  };

  // Auto-rotate cars every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextCar();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container px-4 py-24">
      {/* Header Section */}
      <div className="max-w-2xl mb-20">
        <h2 className="text-5xl md:text-6xl font-normal mb-6 tracking-tight text-left">
          Premium Fleet
          <br />
          <span className="text-gradient font-medium">Options & Services</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-left">
          Experience luxury transportation with our premium fleet of vehicles, perfect for any occasion in New York City.
        </p>
      </div>

      <Tabs defaultValue={features[0].title} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left side - Tab triggers */}
          <div className="md:col-span-5 space-y-3">
            <TabsList className="flex flex-col w-full bg-transparent h-auto p-0 space-y-3">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.title}
                  value={feature.title}
                  className="w-full data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  <FeatureTab
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    isActive={false}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Right side - Carousel with Get Quote button */}
          <div className="md:col-span-7">
  {features.map((feature) => (
    <TabsContent
      key={feature.title}
      value={feature.title}
      className="mt-0 h-full"
    >
      {/* Enhanced Carousel Container with Dark Theme */}
      <div className="relative bg-gray-900 rounded-xl p-1">
        {/* Carousel */}
        <div className="relative overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentCarIndex * 100}%)` }}
          >
            {carData.map((car) => (
              <div key={car.id} className="w-full flex-shrink-0 px-2">
                {/* Professional Car Card with Dark Theme */}
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl border border-gray-700">
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-60 object-cover" 
                    />
                    {/* Premium Badge */}
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      PREMIUM
                    </div>
                  </div>
                  
                  <div className="p-5"> {/* Reduced padding */}
                    <div className="flex justify-between items-start mb-3"> {/* Reduced margin */}
                      <h3 className="text-xl font-bold text-white">{car.name}</h3> {/* Larger text but white */}
                      <p className="text-green-400 font-bold text-lg">{car.price}</p> {/* Brighter green */}
                    </div>
                    
                    <div className="border-t border-gray-700 pt-3 mb-3"> {/* Darker border */}
                      <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide"> {/* Lighter text */}
                        Key Features
                      </h4>
                      <ul className="space-y-1"> {/* Reduced spacing */}
                        {car.features.map((feature, index) => (
                          <li key={index} className="text-gray-300 flex items-center"> {/* Lighter text */}
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> {/* Reduced margin */}
                            <span className="text-xs">{feature}</span> {/* Smaller text */}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                      Get Instant Quote
                    </Button>
                    
                    <p className="text-center text-xs text-gray-500 mt-2"> {/* Reduced margin */}
                      Response within 15 minutes
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Navigation Arrows with Dark Theme */}
          <button
            onClick={prevCar}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-800/90 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-gray-700"
          >
            <ChevronLeft size={18} className="text-white" /> {/* Smaller icon */}
          </button>
          <button
            onClick={nextCar}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-800/90 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-gray-700"
          >
            <ChevronRight size={18} className="text-white" /> {/* Smaller icon */}
          </button>
          
          {/* Minimal Indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5"> {/* Reduced spacing and position */}
            {carData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCarIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentCarIndex ? 'bg-green-500 w-5' : 'bg-gray-600' // Darker inactive dots
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Carousel Progress Bar with Dark Theme */}
        <div className="w-full bg-gray-700 rounded-full h-1 mt-4"> {/* Darker background, reduced margin */}
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${((currentCarIndex + 1) / carData.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </TabsContent>
  ))}
</div>
        </div>
      </Tabs>
    </section>
  );
};
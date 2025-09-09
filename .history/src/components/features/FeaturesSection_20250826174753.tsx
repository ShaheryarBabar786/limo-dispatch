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
                <div className="relative bg-gray-900 rounded-xl p-6">
                  {/* Carousel */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentCarIndex * 100}%)` }}
                    >
                      {carData.map((car) => (
                        <div key={car.id} className="w-full flex-shrink-0">
                          <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                              <p className="text-green-500 font-semibold mb-3">{car.price}</p>
                              <ul className="mb-4">
                                {car.features.map((feature, index) => (
                                  <li key={index} className="text-gray-300 text-sm mb-1 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                                Get Quote
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Navigation arrows */}
                    <button
                      onClick={prevCar}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextCar}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {carData.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentCarIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentCarIndex ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
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
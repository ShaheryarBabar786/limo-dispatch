import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative px-4 pt-32 pb-20 min-h-[60vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url("/lovable-uploads/hero-home.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 rounded-full glass border border-white/20"
          >
            <span className="text-sm font-medium text-white flex items-center justify-center">
              <Car className="w-4 h-4 inline-block mr-2" />
              About Simba Luxury
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            About Us
          </h1>
          <p className="text-xl text-gray-200">
            Learn more about our journey and achievements
          </p>
        </div>
      </motion.section>

      {/* Achievements Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Achievements</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Numbers that speak about our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#0A0A0A] rounded-xl border border-white/10">
              <div className="text-5xl font-bold text-green-600 mb-2">1000+</div>
              <h3 className="text-xl font-semibold text-white mb-2">Happy Clients</h3>
              <p className="text-gray-400">Satisfied customers who trust our service</p>
            </div>
            
            <div className="text-center p-6 bg-[#0A0A0A] rounded-xl border border-white/10">
              <div className="text-5xl font-bold text-green-600 mb-2">5000+</div>
              <h3 className="text-xl font-semibold text-white mb-2">Total Reservations</h3>
              <p className="text-gray-400">Successful rides completed with excellence</p>
            </div>
            
            <div className="text-center p-6 bg-[#0A0A0A] rounded-xl border border-white/10">
              <div className="text-5xl font-bold text-green-600 mb-2">2+</div>
              <h3 className="text-xl font-semibold text-white mb-2">Years</h3>
              <p className="text-gray-400">Of providing premium chauffeur services</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/lovable-uploads/about-us-image.jpg" 
                alt="Simba Luxury Chauffeur Service"
                className="rounded-2xl w-full h-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Welcome to Simba Luxury
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                At Simba Luxury, we believe every journey should be more than just transportation—it should be an experience of comfort, safety, and prestige. Founded with a vision to bring world-class chauffeur service to the heart of New York City, we have become a trusted choice for executives, travelers, and anyone who values timeliness, professionalism, and elegance on the road.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <div className="mr-3 text-green-600">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-white">Professional Chauffeurs</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-green-600">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-white">On-Time Guarantee</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-green-600">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-white">Premium Fleet</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-green-600">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-white">Limo Service</span>
                </div>
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="bg-black">
        <TestimonialsSection />
      </div>

      {/* Trusted By Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Our Clients</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            We have completed and achieved Good Reviews by our satisfied Customers.
          </p>
          
          <div className="flex justify-center mb-12">
            <span className="text-2xl font-bold text-white bg-green-600 px-6 py-3 rounded-lg">Google</span>
          </div>
          
          <p className="text-gray-300 max-w-3xl mx-auto mb-16">
            Enjoy premium chauffeured transportation across New York, New Jersey, Manhattan, Long Island, Newark, and beyond.
          </p>
          
          <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Privacy Policy</h3>
            <p className="text-gray-400">
              We value your privacy and are committed to protecting your personal information. 
              Our privacy policy outlines how we collect, use, and safeguard your data.
            </p>
            <Button variant="outline" className="mt-6 text-white border-white hover:bg-white/10">
              Read Privacy Policy
            </Button>
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

export default AboutUs;
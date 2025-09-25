import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
  };

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
            Contact Us
          </h1>
          <p className="text-xl text-gray-200">
            Get in touch with Simba Luxury
          </p>
        </div>
      </motion.section>

      {/* Contact Information Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Office Near You</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're here to serve you with premium chauffeur services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-8 bg-[#0A0A0A] rounded-xl border border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Email Address</h3>
              <p className="text-gray-400 mb-2">Sent mail anytime</p>
              <a href="mailto:Simbaluxurylimo@gmail.com" className="text-green-600 hover:text-green-500 transition-colors">
                Simbaluxurylimo@gmail.com
              </a>
            </div>
            
            <div className="text-center p-8 bg-[#0A0A0A] rounded-xl border border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-6">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Phone Number</h3>
              <p className="text-gray-400 mb-2">Call us anytime</p>
              <a href="tel:+18887115065" className="text-green-600 hover:text-green-500 transition-colors">
                (888) 711-5065
              </a>
            </div>
            
            <div className="text-center p-8 bg-[#0A0A0A] rounded-xl border border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-6">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Office Address</h3>
              <p className="text-gray-400 mb-2">Visit Our Office</p>
              <p className="text-green-600">
                Oakley St, Massapequa, New York 11758, United States.
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Feel free to contact with us any time. We're here to provide you with the best luxury transportation service.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-300">Simbaluxurylimo@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-300">+1 (888) 711-5065</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-300">Oakley St, Massapequa, New York 11758, United States.</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] p-8 rounded-xl border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    placeholder="Enter the subject"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors resize-none"
                    placeholder="Enter your message"
                    required
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) - You can add a Google Map here later */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Location</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Enjoy premium chauffeured transportation across New York, New Jersey, Manhattan, Long Island, Newark, and beyond.
          </p>
          
          {/* Placeholder for Google Map */}
          <div className="bg-[#0A0A0A] rounded-xl border border-white/10 p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Map would be displayed here</p>
              <p className="text-white font-semibold">Oakley St, Massapequa, New York 11758</p>
            </div>
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

export default ContactUs;
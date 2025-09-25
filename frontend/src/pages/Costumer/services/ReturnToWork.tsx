import { motion } from "framer-motion";
import { Shield, Users, Map, Bell, BarChart3, Wifi, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

const ReturnToWork = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    employees: "",
    locations: "",
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
    console.log("Form submitted:", formData);
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Health & safety first",
      description: "The management portal is filled with features for ensuring the safety of your workforce, including one-click contact tracing."
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Management tools",
      description: "Monitor your employee transportation in real-time. Track vehicles, see which employees have boarded, get alerted on delays."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Dynamic Goal Oriented Service",
      description: "With powerful routing algorithms and operational excellence, you can evaluate multiple service scenarios and modify your routes, vehicles, and more based on changing needs."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Great employee experience",
      description: "Employees can self-certify their health in the app. They also get real-time vehicle location, arrival notifications, and more."
    }
  ];

  const benefits = [
    {
      forCompany: [
        "ROUTE PLANNING & REAL-TIME OPTIMIZATION",
        "CONTACT TRACING REPORTS",
        "IN-APP DAILY HEALTH & SYMPTOM WORKFLOW",
        "CAPACITY MANAGEMENT FOR SOCIAL DISTANCING",
        "REAL TIME MANAGEMENT PORTAL",
        "COST SHARING WITH EMPLOYEES"
      ],
      forEmployees: [
        "A PRODUCTIVE COMMUTE, NO SITTING BEHIND THE WHEEL IN TRAFFIC",
        "MOBILE APP WITH ETAs, LIVE VEHICLE TRACKING, AND REAL-TIME NOTIFICATIONS",
        "MULTIPLE PAYMENT OPTIONS",
        "CHARGING PORTS, ONBOARD WIFI, PLUSH LEATHER SEATS"
      ]
    }
  ];

  const safetyMeasures = [
    {
      title: "VEHICLE CLEANING",
      description: "All vehicles are maintained in accordance with an established program aimed at providing a clean and comfortable riding environment. Each vehicle is tidied between trips and subsequently undergoes a comprehensive program every night that includes cleaning, sanitizing and disinfecting each vehicle in our fleet."
    },
    {
      title: "EMPLOYEE & CHAUFFEUR HEALTH",
      description: "Chauffeurs temperatures and overall health are being monitored daily. We have provided the majority of our employees with the ability to work remotely to minimize the spreading of any germs."
    },
    {
      title: "MAINTAINING STANDARDS",
      description: "Our health and safety practices go above and beyond the industry standard. As we continue to navigate through this period together, we want you to know that we are taking every extra step possible to ensure your comfort and peace of mind."
    },
    {
      title: "24/7 SUPPORT",
      description: "If you and/or your family do have to travel during this time, we want to remind you that we are here for you through every step of your journey."
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
            Return to Work Shuttle
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            LOOKING FOR THE SAFEST WAY TO GET YOUR EMPLOYEES BACK TO THE OFFICE?
          </p>
        </div>
      </motion.section>

      {/* Intro Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-gray-300 text-lg leading-relaxed">
              WE'VE COMBINED INNOVATIVE CONSUMER APPS, SOFTWARE PLATFORM & POWERFUL ALGORITHMS 
              WITH OUR INDUSTRY-LEADING SERVICE, TO CREATE THE BEST ALTERNATIVE TO PUBLIC TRANSIT OR RIDE-SHARING.
            </p>
          </div>

          <div className="text-center mb-16">
            <div className="bg-[#0A0A0A] p-8 rounded-xl border border-white/10 inline-block mb-8">
              <span className="text-green-600 font-bold text-lg">Powered by: Advanced Technology</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            TECHNOLOGY THAT WORKS FOR YOU
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10"
              >
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">YOUR COMPANY</h3>
              <ul className="space-y-3">
                {benefits[0].forCompany.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">YOUR EMPLOYEES</h3>
              <ul className="space-y-3">
                {benefits[0].forEmployees.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safety Measures */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              STEPS WE ARE TAKING
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetyMeasures.map((measure, index) => (
                <div key={index} className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">{measure.title}</h3>
                  <p className="text-gray-400">{measure.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-white mb-6">Other important resources</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "World Health Organization (WHO) - Advice",
                "Centers for Disease Control (CDC) - Recommendations",
                "Health Program & Guidelines Document",
                "Video Resources"
              ].map((resource, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-[#0A0A0A] px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  {resource}
                </a>
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
              Get Started with Return to Work Shuttle
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company*</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Employees</label>
                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Office Locations</label>
                  <input
                    type="text"
                    name="locations"
                    value={formData.locations}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
                    placeholder="e.g., Manhattan, Brooklyn, etc."
                  />
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
                  placeholder="Tell us about your specific needs and requirements..."
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                Request Consultation
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReturnToWork;
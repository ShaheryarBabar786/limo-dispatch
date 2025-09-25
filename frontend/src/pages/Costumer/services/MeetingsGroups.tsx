import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, MessageCircle, MapPin, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

const MeetingsGroups = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
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
            Meetings and Groups
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Expertly crafted solutions for group transportation that minimize cost and maximize peace of mind
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              From detailed logistics to passenger manifests and updates, event walkthroughs and on-site management, 
              our ace Meetings team take the stress off our client's shoulders, giving them time to focus on more important things.
            </p>
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              BY YOUR SIDE THROUGHOUT THE EVENT LIFECYCLE, EVEN AFTER THE LAST CAR PULLS AWAY
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageCircle className="w-8 h-8" />,
                  title: "Connect",
                  description: "Your dedicated Events manager is your singular contact for booking trips, changes and cancellation needs. Every event comes with its own set of challenges, and they have the best solutions."
                },
                {
                  icon: <MapPin className="w-8 h-8" />,
                  title: "Planning",
                  description: "Strategically selecting vehicles to match group needs, and logistically planning options to fit your budget. Our team is seasoned for handling the many contingencies that accompany even the most carefully executed event plan."
                },
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Confirmation",
                  description: "Sharing up-to-date event manifest of group travel details and confirmations. Your Events manager is responsible for sharing information with our Operations team, ensuring consistent level of quality control."
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Onsite",
                  description: "From walkthroughs to meeting and receiving vehicles, to anticipating everything in between, our Onsite team provides an unmatched level of service for managing event transportation."
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Wrap-up",
                  description: "Centralized billing and one simple invoice for each event. Like the transportation, billing can be customized based on your needs."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10 text-center"
                >
                  <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              What Our Clients Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "As the second program we have used EmpireCLS' Group Transportation for, I cannot sing your praises enough. You and your team have made these logistics totally seamless. The attention to detail, timeliness and organization helps us immensely. It is our pleasure to work with a great team like yours. We look forward to the next opportunity to partner with you.",
                  author: "Kelsey D."
                },
                {
                  quote: "Thank you so much for all your assistance with transportation for our wedding weekend. It was a great comfort knowing our families and close friends did not have to stress about any of the details, and were well taken care of by the service of EmpireCLS. You were always accommodating and pleasant to work with, I really appreciate all that you did to help out a very busy bride!",
                  author: "Peggy H."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-[#0A0A0A] p-8 rounded-xl border border-white/10">
                  <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-green-600 font-semibold">~ {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-[#0A0A0A] rounded-2xl p-8 md:p-12 border border-white/10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Depend upon our onsite management professionals for your event transportation experience
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              From conferences and company parties, to sports events, premieres and award shows, 
              we're skilled to handle any size event with our diverse fleet and professional service.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Mobility", desc: "Immediately adapt to last-minute changes, adding or canceling trips, and communicating directly with chauffeurs and Dispatch" },
                { title: "Diversity", desc: "From sedans to coach buses, meeting and travel planners love our diversified fleet and one-stop approach for transportation" },
                { title: "Service", desc: "Professionals delivering nothing less than exceptional service you expect from your own team" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <h4 className="text-green-600 font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
              tell us more about your group needs
            </h2>
            <p className="text-gray-400 text-center mb-8">(we're all ears)</p>
            
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors"
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
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-colors resize-none"
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MeetingsGroups;
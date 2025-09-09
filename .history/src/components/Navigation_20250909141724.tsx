import { useState, useEffect } from "react";
import { Menu, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Add the animation styles to the document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulseServices {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      
      .animate-services {
        animation: pulseServices 2s;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up the style element
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Add animation class to the services section if that's the target
      if (sectionId === 'services') {
        // Add a small delay to ensure the section is in view before animating
        setTimeout(() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) {
            servicesSection.classList.add('animate-services');
            
            // Remove the class after animation completes to allow re-triggering
            setTimeout(() => {
              servicesSection.classList.remove('animate-services');
            }, 2000);
          }
        }, 500);
      }
    }
  };

  const navItems = [
    { name: "Home", href: "#home", onClick: () => scrollToSection('home') },
    { name: "About Us", href: "#about", onClick: () => scrollToSection('about') },
    { name: "Services", href: "#services", onClick: () => scrollToSection('services') },
    { name: "Our Fleet", href: "#fleet", onClick: () => scrollToSection('fleet') },
    { name: "Contact", href: "#contact", onClick: () => scrollToSection('contact') },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="g-gray-900 text-white py-2 text-sm">
        <div className="mx-auto px-6 max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span>📞</span> +1 (888) 711-5065
            </span>
            <span className="flex items-center gap-1">
              <span>✉️</span> info@simbaluxury.com
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-gray-400">Follow us:</span>
            <div className="flex gap-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`fixed top-8 left-0 right-0 z-1000 transition-all duration-300 ${
          isScrolled 
            ? "h-16 bg-[#1B1B1B]/90 backdrop-blur-xl border-b border-white/10 mt-0" 
            : "h-16 bg-[#1B1B1B] mt-0"
        }`}
        style={{ top: '32px' }}
      >
        <div className="mx-auto h-full px-6 max-w-7xl">
          <nav className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-white">CryptoTrade</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  className="text-sm text-gray-300 hover:text-white transition-all duration-300 relative group"
                >
                  {item.name}
                  {/* Animated underline for Services */}
                  {item.name === "Services" && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                  )}
                  {/* Regular underline for other items */}
                  {item.name !== "Services" && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  )}
                </a>
              ))}
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white transition-transform duration-300 hover:scale-105"
                onClick={() => console.log("Call button clicked")}
              >
                📞 +1 (888) 711-5065
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="glass transition-transform duration-300 hover:scale-110">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#1B1B1B]">
                  <div className="flex flex-col gap-6 mt-8">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-lg text-gray-300 hover:text-white transition-colors transform hover:translate-x-2 duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMobileMenuOpen(false);
                          if (item.onClick) {
                            item.onClick();
                          }
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                    <div className="pt-4 border-t border-gray-700">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white w-full transition-transform duration-300 hover:scale-105"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          console.log("Call button clicked");
                        }}
                      >
                        +1 (888) 711-5065
                      </Button>
                    </div>
                    <div className="pt-4 border-t border-gray-700 flex justify-center gap-4">
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white transition-colors transform hover:scale-125 duration-300"
                        aria-label="Facebook"
                      >
                        <Facebook size={20} />
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white transition-colors transform hover:scale-125 duration-300"
                        aria-label="Instagram"
                      >
                        <Instagram size={20} />
                      </a>
                      <a 
                        href="https://twitter.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white transition-colors transform hover:scale-125 duration-300"
                        aria-label="Twitter"
                      >
                        <Twitter size={20} />
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navigation;
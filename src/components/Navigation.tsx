import { useState, useEffect } from "react";
import { Menu, Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

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
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, []);

  const handleHomeClick = (e: React.MouseEvent, sectionId?: string) => {
    if (location.pathname !== "/") {
      // If we're not on the home page, navigate to home first
      e.preventDefault();
      navigate("/");
      
      // Wait for navigation to complete, then scroll to section
      setTimeout(() => {
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else if (sectionId) {
      // If we're already on home page, just scroll to section
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleServicesEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setIsServicesOpen(true);
  };

  const handleServicesLeave = () => {
    // Add a small delay before closing to allow cursor to move to dropdown
    const timeout = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setIsServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    // Close immediately when leaving dropdown
    setIsServicesOpen(false);
  };

  const serviceItems = [
    { name: "Meetings and Groups", path: "/services/meetings-groups" },
    { name: "MotorCoaches", path: "/services/motorcoaches" },
    { name: "Airport Greetings", path: "/services/airport-greetings" },
    { name: "Return to Work Shuttle", path: "/services/return-to-work" },
  ];

  const navItems = [
    { name: "Home", path: "/", onClick: (e: React.MouseEvent) => handleHomeClick(e) },
    { 
      name: "Services", 
      path: "#",
      isDropdown: true,
      items: serviceItems
    },
    { name: "Our Fleet", path: "/fleet" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="z-50 bg-gray-900 text-white py-2 text-sm">
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
        className={`z-40 transition-all duration-300 ${
          isScrolled 
            ? "h-16 bg-[#1B1B1B]/90 backdrop-blur-xl border-b border-white/10 mt-0" 
            : "h-16 bg-[#1B1B1B] mt-0"
        }`}
        style={{ top: '32px' }}
      >
        <div className="mx-auto h-full px-6 max-w-7xl">
          <nav className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <Link to="/" className="font-bold text-xl text-white">
                Simba Luxury
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                item.isDropdown ? (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={handleServicesEnter}
                    onMouseLeave={handleServicesLeave}
                  >
                    <button
                      className="text-sm text-gray-300 hover:text-white transition-all duration-300 relative flex items-center"
                    >
                      {item.name}
                      <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300" />
                    </button>
                    
                    {/* Services Dropdown */}
                    {isServicesOpen && (
                      <div 
                        className="absolute top-full left-0 mt-0 w-48 bg-[#1B1B1B] border border-white/10 rounded-lg shadow-2xl py-2 z-50"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {item.items?.map((service) => (
                          <Link
                            key={service.name}
                            to={service.path}
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={(e) => {
                      if (item.onClick) {
                        item.onClick(e);
                      }
                    }}
                    className="text-sm text-gray-300 hover:text-white transition-all duration-300 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )
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
                      item.isDropdown ? (
                        <div key={item.name} className="space-y-2">
                          <p className="text-lg font-semibold text-white">{item.name}</p>
                          <div className="pl-4 space-y-2">
                            {item.items?.map((service) => (
                              <Link
                                key={service.name}
                                to={service.path}
                                className="block text-gray-300 hover:text-white transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-lg text-gray-300 hover:text-white transition-colors transform hover:translate-x-2 duration-300"
                          onClick={(e) => {
                            if (item.onClick) {
                              item.onClick(e);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {item.name}
                        </Link>
                      )
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
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white py-2 text-sm">
        <div className="mx-auto px-6 max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span>📞</span> +1 (888) 711-5065
            </span>
            <span className="flex items-center gap-1">
              <span>✉️</span> info@simbaluxury.com
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Follow us:</span>
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
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
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
                  className="text-sm text-gray-300 hover:text-white transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => console.log("Call button clicked")}
              >
                📞 +1 (888) 711-5065
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="glass">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#1B1B1B]">
                  <div className="flex flex-col gap-6 mt-8">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-lg text-gray-300 hover:text-white transition-colors"
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
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          console.log("Call button clicked");
                        }}
                      >
                        +1 (888) 711-5065
                      </Button>
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
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "h-16 bg-[#1B1B1B]/90 backdrop-blur-xl border-b border-white/10" 
          : "h-16 bg-[#1B1B1B]"
      }`}
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
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-white">+1 (888) 711-5065</span>
            </div>
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
                    <span className="text-lg text-white">+1 (888) 711-5065</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
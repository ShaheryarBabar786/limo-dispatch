import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from './pages/AboutUs';
import ContactUs from "./pages/ContactUs";
import Fleet from "./pages/Fleet";
import MeetingsGroups from "./pages/services/MeetingsGroups";
import Motorcoaches from "./pages/services/Motorcoaches";
import AirportGreetings from "./pages/services/AirportGreetings";
import ReturnToWork from "./pages/services/ReturnToWork";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/services/meetings-groups" element={<MeetingsGroups />} />
            <Route path="/services/motorcoaches" element={<Motorcoaches />} />
            <Route path="/services/airport-greetings" element={<AirportGreetings />} />
            <Route path="/services/return-to-work" element={<ReturnToWork />} />
            <Route path="/contact" element={<ContactUs />} />

          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import React from "react";
import { BrowserRouter as Router, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Components
import AdminNavbar from "./pages/Admin/components/Navbars/AdminNavbar";
import Footer from "./pages/Admin/components/Footer/Footer";
import Sidebar from "./pages/Admin/components/Sidebar/Sidebar";

// Update import paths for routes and image
import routes from "./pages/Admin/routes";
import sidebarImage from "./pages/Admin/assets/img/sidebar-3.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Add CSS imports here
import "./pages/Admin/assets/css/animate.min.css";
import "./pages/Admin/assets/scss/light-bootstrap-dashboard-react.scss";
import "./pages/Admin/assets/css/demo.css";

// Customer Components
import Index from "./pages/Costumer/Index";
import AboutUs from "./pages/Costumer/AboutUs";
import Fleet from "./pages/Costumer/Fleet";
import MeetingsGroups from "./pages/Costumer/services/MeetingsGroups";
import Motorcoaches from "./pages/Costumer/services/Motorcoaches";
import AirportGreetings from "./pages/Costumer/services/AirportGreetings";
import ReturnToWork from "./pages/Costumer/services/ReturnToWork";
import ContactUs from "./pages/Costumer/ContactUs";
import Login from "./pages/Admin/authentication/Login";

// Admin Page Components
import Dashboard from "./pages/Admin/views/Dashboard";
import UserProfile from "./pages/Admin/views/UserProfile";
import TableList from "./pages/Admin/views/TableList";

interface RouteType {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  layout: string;
  redirect?: boolean;
  upgrade?: boolean;
  exact?: boolean;
}

// Admin Layout Component
function AdminLayout() {
  const location = useLocation();
  const mainPanel = React.useRef<HTMLDivElement>(null);
  const [image] = React.useState<string>(sidebarImage);
  const [color] = React.useState<string>("black");
  const [hasImage] = React.useState<boolean>(true);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement!.scrollTop = 0;
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
    
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      const element = document.getElementById("bodyClick");
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel" ref={mainPanel}>
        <AdminNavbar />
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/table" element={<TableList />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

// Main App Content
function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/admin/login" element={<Login />} />
      
      {/* Customer Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/fleet" element={<Fleet />} />
      <Route path="/services/meetings-groups" element={<MeetingsGroups />} />
      <Route path="/services/motorcoaches" element={<Motorcoaches />} />
      <Route path="/services/airport-greetings" element={<AirportGreetings />} />
      <Route path="/services/return-to-work" element={<ReturnToWork />} />
      <Route path="/contact" element={<ContactUs />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Navigate to="/admin/dashboard" replace />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/*" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
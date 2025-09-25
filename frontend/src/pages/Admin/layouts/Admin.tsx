import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";

// Update import paths to use relative paths
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";

// Update import paths for routes and image
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";

// Import views with updated paths
import Dashboard from "../views/Dashboard";
import UserProfile from "../views/UserProfile";
import TableList from "../views/TableList";

interface RouteType {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  layout: string;
}

function Admin() {
  const [image, setImage] = React.useState<string>(sidebarImage);
  const [color, setColor] = React.useState<string>("black");
  const [hasImage, setHasImage] = React.useState<boolean>(true);
  const location = useLocation();
  const mainPanel = React.useRef<HTMLDivElement>(null);
  
  // Map routes to components
  const getRoutes = (): JSX.Element[] => {
    return routes.map((prop: RouteType, key: number) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.path}
            element={<prop.component />}
            key={key}
          />
        );
      }
      return null as unknown as JSX.Element;
    });
  };

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
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Routes>
              {getRoutes()}
              {/* Add direct routes as fallback */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<UserProfile />} />
              <Route path="/table" element={<TableList />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
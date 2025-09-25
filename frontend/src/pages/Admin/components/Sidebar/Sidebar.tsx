import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

interface RouteType {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  layout: string;
  redirect?: boolean;
  upgrade?: boolean;
}

interface SidebarProps {
  color: string;
  image: string;
  routes: RouteType[];
}

function Sidebar({ color, image, routes }: SidebarProps) {
  const location = useLocation();
  
  const activeRoute = (routeName: string): string => {
    return location.pathname.includes(routeName) ? "active" : "";
  };

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: `url(${image})`
        }}
      />
      
      <div className="sidebar-wrapper align-items-center">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="logo-img">
              {/* <img src={require("assets/img/reactlogo.png")} alt="Creative Tim Logo" /> */}
            </div>
          </a>
          Limo Dispatch Admin
        </div>
        
        <Nav>
          {routes.map((prop, key) => {
            if (prop.redirect) return null;
            
            return (
              <li
                className={
                  prop.upgrade
                    ? "active active-pro"
                    : activeRoute(prop.layout + prop.path)
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-link"
                >
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
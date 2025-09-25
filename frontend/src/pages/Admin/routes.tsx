// Update all import paths to use relative paths
import Dashboard from "./views/Dashboard";
import UserProfile from "./views/UserProfile";
import TableList from "./views/TableList";

interface DashboardRoute {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  layout: string;
  redirect?: boolean;
  upgrade?: boolean;
  exact?: boolean;
}

const dashboardRoutes: DashboardRoute[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fa fa-chart-pie", 
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Booking Management",
    icon: "fa fa-table", 
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "fa fa-user",   
    component: UserProfile,
    layout: "/admin"
  }
];

export default dashboardRoutes;

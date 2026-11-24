
import { createBrowserRouter } from "react-router-dom";
import Reports from "../features/enterprise/pages/Reports";
import Meters from "../features/enterprise/pages/Meters";
import Dashboard from "../features/end-user/pages/Dashboard";
import EnterpriseLayout from "../features/enterprise/components/EnterpriseLayout";
import EnterpriseDashboard from "../features/enterprise/pages/Dashboard";
import Zones from "../features/enterprise/pages/Zones";
import Users from "../features/enterprise/pages/Users";
import ZoneDetails from "../features/enterprise/pages/ZoneDetails";
import Alerts from "../features/enterprise/pages/Alerts";
import AuditLogs from "../features/enterprise/pages/AuditLogs";
import Settings from "../features/enterprise/pages/Settings";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/enterprise",
    element: <EnterpriseLayout />,
    children: [
      {
        path: "dashboard",
        element: <EnterpriseDashboard />,
      },
      {
        path: "zones",
        element: <Zones />,
      },
      {
        path: "zones/:zoneId",
        element: <ZoneDetails />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "meters",
        element: <Meters />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "settings", element: <Settings /> },
        
    ],
  },
]);

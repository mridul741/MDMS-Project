
import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Dashboard from "../features/end-user/pages/Dashboard";

import AppLayout from "../shared/layout/AppLayout";
import RouteErrorBoundary from "../shared/routes/RouteErrorBoundary";

import {
  MeterDetails,
  MeterManagement,
  Reports as ZoneReports,
  Alerts as ZoneAlerts,
  UserManagement,
  ZoneDashboard,
  ZoneSettings,
} from "../features/zone/components/ZoneRoutePages";

import EnterpriseLayout from "../features/enterprise/components/EnterpriseLayout";
import EnterpriseDashboard from "../features/enterprise/pages/Dashboard";
import Zones from "../features/enterprise/pages/Zones";
import Users from "../features/enterprise/pages/Users";
import ZoneDetails from "../features/enterprise/pages/ZoneDetails";
import Meters from "../features/enterprise/pages/Meters";
import Reports from "../features/enterprise/pages/Reports";
import Alerts from "../features/enterprise/pages/Alerts";
import AuditLogs from "../features/enterprise/pages/AuditLogs";
import Settings from "../features/enterprise/pages/Settings";

const loadingPage = (
  <div className="zone-page-loading" role="status">
    Loading page…
  </div>
);

function lazyElement(element: ReactNode) {
  return <Suspense fallback={loadingPage}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <RouteErrorBoundary />,
  },

  // Zone Admin routes
  {
    path: "/zone",
    element: <AppLayout role="zone" />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/zone/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: lazyElement(<ZoneDashboard />),
      },
      {
        path: "meters",
        element: lazyElement(<MeterManagement />),
      },
      {
        path: "meters/:meterId",
        element: lazyElement(<MeterDetails />),
      },
      {
        path: "users",
        element: lazyElement(<UserManagement />),
      },
      {
        path: "reports",
        element: lazyElement(<ZoneReports />),
      },
      {
        path: "alerts",
        element: lazyElement(<ZoneAlerts />),
      },
      {
        path: "settings",
        element: lazyElement(<ZoneSettings />),
      },
    ],
  },

  // Enterprise routes
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
      {
        path: "audit-logs",
        element: <AuditLogs />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

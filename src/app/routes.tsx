import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../features/end-user/pages/Dashboard";
import ZoneLayout from "../features/zone/components/ZoneLayout";
import RouteErrorBoundary from "../shared/routes/RouteErrorBoundary";
import {
  Alerts,
  MeterDetails,
  MeterManagement,
  Reports,
  UserManagement,
  ZoneDashboard,
  ZoneSettings,
} from "../features/zone/components/ZoneRoutePages";
const loadingPage = <div className="zone-page-loading" role="status">Loading page…</div>;

function lazyElement(element: ReactNode) {
  return <Suspense fallback={loadingPage}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/zone",
    element: <ZoneLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/zone/dashboard" replace /> },
      { path: "dashboard", element: lazyElement(<ZoneDashboard />) },
      { path: "meters", element: lazyElement(<MeterManagement />) },
      { path: "meters/:meterId", element: lazyElement(<MeterDetails />) },
      { path: "users", element: lazyElement(<UserManagement />) },
      { path: "reports", element: lazyElement(<Reports />) },
      { path: "alerts", element: lazyElement(<Alerts />) },
      { path: "settings", element: lazyElement(<ZoneSettings />) },
    ],
  },
]);

import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import UserLayout from "../features/end-user/components/UserLayout";
import Dashboard from "../features/end-user/pages/Dashboard";
import Bills from "../features/end-user/pages/Bills";
import BillDetails from "../features/end-user/pages/BillDetails";
import MeterData from "../features/end-user/pages/MeterData";
import UserAlerts from "../features/end-user/pages/UserAlerts";
import Profile from "../features/end-user/pages/Profile";

import AppLayout from "../shared/layout/AppLayout";
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
    element: <Navigate to="/user/dashboard" replace />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "user/dashboard", element: <Dashboard /> },
      { path: "user/bills", element: <Bills /> },
      { path: "user/bills/:billId", element: <BillDetails /> },
      { path: "user/meter-data", element: <MeterData /> },
      { path: "user/alerts", element: <UserAlerts /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/zone",
    element: <AppLayout role="zone" />,
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

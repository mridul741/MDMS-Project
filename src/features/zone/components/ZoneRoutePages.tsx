import { lazy } from "react";
import "../zone.css";

export const ZoneDashboard = lazy(() => import("../pages/Dashboard"));
export const MeterManagement = lazy(() => import("../pages/MeterManagement"));
export const MeterDetails = lazy(() => import("../pages/MeterDetails"));
export const UserManagement = lazy(() => import("../pages/UserManagement"));
export const Reports = lazy(() => import("../pages/Reports"));
export const Alerts = lazy(() => import("../pages/Alerts"));
export const ZoneSettings = lazy(() => import("../pages/ZoneSettings"));

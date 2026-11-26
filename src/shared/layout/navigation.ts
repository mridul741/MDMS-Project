import {
  Bell,
  ChartNoAxesCombined,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  MapPin,
  Settings,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type WorkspaceRole = "end-user" | "zone" | "enterprise";

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

interface LayoutConfiguration {
  roleLabel: string;
  workspace: string;
  initials: string;
  userName: string;
  email: string;
  homePath: string;
  settingsPath: string;
  notificationsPath: string;
  navigation: NavigationItem[];
}

export const APP_NAVIGATION: Record<WorkspaceRole, LayoutConfiguration> = {
  "end-user": {
    roleLabel: "Consumer",
    workspace: "My account",
    initials: "AR",
    userName: "Ananya Rao",
    email: "ananya.rao@mdms.in",
    homePath: "/user/dashboard",
    settingsPath: "/user/profile",
    notificationsPath: "/user/notifications",
    navigation: [
      { label: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
      { label: "Bills & payments", path: "/user/bills", icon: WalletCards },
      { label: "Meter readings", path: "/user/readings", icon: Gauge },
      { label: "Notifications", path: "/user/notifications", icon: Bell },
      { label: "Profile", path: "/user/profile", icon: UserRound },
    ],
  },
  zone: {
    roleLabel: "Zone administrator",
    workspace: "Mangalore Zone",
    initials: "RS",
    userName: "Rahul Sharma",
    email: "rahul.sharma@mdms.in",
    homePath: "/zone/dashboard",
    settingsPath: "/zone/settings",
    notificationsPath: "/zone/alerts",
    navigation: [
      { label: "Dashboard", path: "/zone/dashboard", icon: LayoutDashboard },
      { label: "Meter Management", path: "/zone/meters", icon: Gauge },
      { label: "User Management", path: "/zone/users", icon: UserRound },
      { label: "Reports & Analytics", path: "/zone/reports", icon: ChartNoAxesCombined },
      { label: "Alerts", path: "/zone/alerts", icon: Bell, badge: "18" },
      { label: "Settings", path: "/zone/settings", icon: Settings },
    ],
  },
  enterprise: {
    roleLabel: "Enterprise administrator",
    workspace: "All zones",
    initials: "EA",
    userName: "Enterprise Admin",
    email: "admin@mdms.in",
    homePath: "/enterprise/dashboard",
    settingsPath: "/enterprise/settings",
    notificationsPath: "/enterprise/alerts",
    navigation: [
      { label: "Dashboard", path: "/enterprise/dashboard", icon: LayoutDashboard },
      { label: "Zones", path: "/enterprise/zones", icon: MapPin },
      { label: "Meters", path: "/enterprise/meters", icon: Gauge },
      { label: "Users & roles", path: "/enterprise/users", icon: Users },
      { label: "Reports", path: "/enterprise/reports", icon: ChartNoAxesCombined },
      { label: "Alerts", path: "/enterprise/alerts", icon: Bell },
      { label: "Audit logs", path: "/enterprise/audit-logs", icon: ClipboardList },
      { label: "Settings", path: "/enterprise/settings", icon: Settings },
    ],
  },
};

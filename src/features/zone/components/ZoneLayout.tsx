import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  ChevronRight,
  ChartNoAxesCombined,
  Gauge,
  Globe,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  Zap,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ZONE_ID } from "../types/zone";
import "../zone.css";

const navigation = [
  { label: "Dashboard", path: "/zone/dashboard", icon: LayoutDashboard },
  { label: "Meter Management", path: "/zone/meters", icon: Gauge },
  { label: "User Management", path: "/zone/users", icon: UserRound },
  { label: "Reports & Analytics", path: "/zone/reports", icon: ChartNoAxesCombined },
  { label: "Alerts", path: "/zone/alerts", icon: Bell },
  { label: "Settings", path: "/zone/settings", icon: Settings },
];

export default function ZoneLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("mdms-theme") === "dark");
  const location = useLocation();
  const currentPage = navigation.find((item) => location.pathname.startsWith(item.path));

  useEffect(() => {
    localStorage.setItem("mdms-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={`zone-shell ${dark ? "dark" : ""} ${collapsed ? "zone-sidebar-collapsed" : ""}`}>
      <aside className={`zone-sidebar ${mobileOpen ? "zone-mobile-open" : ""}`}>
        <NavLink to="/zone/dashboard" className="zone-brand">
          <span className="zone-brand-mark"><Zap size={21} fill="currentColor" /></span>
          <span>MDMS<small>Meter data management</small></span>
        </NavLink>
        <div className="zone-workspace">
          <span className="zone-workspace-icon"><MapPin size={17} /></span>
          <span><strong>Mangalore Zone</strong><small>Zone administrator</small></span>
          <ChevronDown size={15} />
        </div>
        <span className="zone-nav-caption">WORKSPACE</span>
        <nav className="zone-nav" aria-label="Zone administration">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `zone-nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Alerts" && <b>18</b>}
            </NavLink>
          ))}
        </nav>
        <div className="zone-sidebar-footer">
          <div className="zone-health">
            <ShieldCheck size={17} />
            <span><strong>Systems operational</strong><small><i /> Synced just now</small></span>
          </div>
          <button type="button" className="zone-collapse" onClick={() => setCollapsed(!collapsed)}>
            <Activity size={17} /><span>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        </div>
      </aside>
      {mobileOpen && <button className="zone-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <div className="zone-main">
        <header className="zone-header">
          <div className="zone-breadcrumb">
            <button type="button" className="zone-menu-button" aria-label="Toggle navigation" onClick={() => {
              if (window.innerWidth < 900) setMobileOpen(!mobileOpen);
              else setCollapsed(!collapsed);
            }}>
              <Menu size={19} />
            </button>
            <span>Workspace</span><ChevronRight size={14} /><strong>{currentPage?.label ?? "Dashboard"}</strong>
          </div>
          <div className="zone-header-tools">
            <button type="button" className="zone-icon-button" aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={() => setDark(!dark)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <label className="zone-language">
              <Globe size={16} />
              <select aria-label="Language">
                <option>EN</option><option>ಕನ್ನಡ</option><option>हिन्दी</option>
              </select>
            </label>
            <NavLink to="/zone/alerts" className="zone-icon-button zone-notification" aria-label="View alerts">
              <Bell size={18} /><span className="zone-notification-count">18</span>
            </NavLink>
            <details className="zone-profile-menu">
              <summary>
                <span className="zone-avatar">RS</span>
                <span className="zone-profile-copy"><strong>Rahul Sharma</strong><small>Zone Admin</small></span>
                <ChevronDown size={14} />
              </summary>
              <div className="zone-profile-dropdown">
                <div><strong>Rahul Sharma</strong><small>rahul.sharma@mdms.in</small></div>
                <NavLink to="/zone/settings"><Settings size={15} /> Settings</NavLink>
                <button type="button" onClick={() => window.alert("This read-only demo has no active session.")}><LogOut size={15} /> Log out</button>
              </div>
            </details>
          </div>
        </header>
        <main className="zone-content">
          <Outlet context={{ zoneId: ZONE_ID }} />
        </main>
        <footer className="zone-footer">
          <span>© 2026 MDMS · Meter Data Management System</span>
          <span><i /> System online <b>·</b> Mangalore Zone</span>
        </footer>
      </div>
    </div>
  );
}

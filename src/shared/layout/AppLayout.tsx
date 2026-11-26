import { useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  ChevronRight,
  Globe,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { APP_NAVIGATION, type WorkspaceRole } from "./navigation";
import { useAppTheme } from "../theme/useAppTheme";
import "./AppLayout.css";

export default function AppLayout({ role }: { role: WorkspaceRole }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useAppTheme();
  const location = useLocation();
  const configuration = APP_NAVIGATION[role];
  const currentPage = configuration.navigation.find(({ path }) =>
    location.pathname.startsWith(path),
  );

  return (
    <div
      className={`mdms-shell${isDark ? " dark" : ""}${collapsed ? " mdms-sidebar-collapsed" : ""}`}
      data-role={role}
    >
      <aside className={`mdms-sidebar${mobileOpen ? " mdms-mobile-open" : ""}`}>
        <NavLink to={configuration.homePath} className="mdms-brand">
          <span className="mdms-brand-mark"><Zap size={21} fill="currentColor" /></span>
          <span>MDMS<small>Meter data management</small></span>
        </NavLink>
        <div className="mdms-workspace">
          <span className="mdms-workspace-icon"><MapPin size={17} /></span>
          <span><strong>{configuration.workspace}</strong><small>{configuration.roleLabel}</small></span>
          <ChevronDown size={15} />
        </div>
        <span className="mdms-nav-caption">WORKSPACE</span>
        <nav className="mdms-nav" aria-label={`${configuration.roleLabel} navigation`}>
          {configuration.navigation.map(({ label, path, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `mdms-nav-link${isActive ? " active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge && <b>{badge}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="mdms-sidebar-footer">
          <div className="mdms-health">
            <ShieldCheck size={17} />
            <span><strong>Systems operational</strong><small><i /> Synced just now</small></span>
          </div>
          <button
            type="button"
            className="mdms-collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((current) => !current)}
          >
            <Activity size={17} /><span>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="mdms-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="mdms-main">
        <header className="mdms-header">
          <div className="mdms-breadcrumb">
            <button
              type="button"
              className="mdms-menu-button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => {
                if (window.innerWidth < 900) setMobileOpen((current) => !current);
                else setCollapsed((current) => !current);
              }}
            >
              <Menu size={19} />
            </button>
            <span>Workspace</span><ChevronRight size={14} />
            <strong>{currentPage?.label ?? "Dashboard"}</strong>
          </div>
          <div className="mdms-header-tools">
            <button
              type="button"
              className="mdms-icon-button"
              aria-label={isDark ? "Use light theme" : "Use dark theme"}
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <label className="mdms-language">
              <Globe size={16} />
              <select aria-label="Language">
                <option>EN</option><option>ಕನ್ನಡ</option><option>हिन्दी</option>
              </select>
            </label>
            <NavLink
              to={configuration.notificationsPath}
              className="mdms-icon-button mdms-notification"
              aria-label="View notifications"
            >
              <Bell size={18} />
              {role === "zone" && <span className="mdms-notification-count">18</span>}
            </NavLink>
            <details className="mdms-profile-menu">
              <summary>
                <span className="mdms-avatar">{configuration.initials}</span>
                <span className="mdms-profile-copy">
                  <strong>{configuration.userName}</strong><small>{configuration.roleLabel}</small>
                </span>
                <ChevronDown size={14} />
              </summary>
              <div className="mdms-profile-dropdown">
                <div><strong>{configuration.userName}</strong><small>{configuration.email}</small></div>
                <NavLink to={configuration.settingsPath}><Settings size={15} /> Settings</NavLink>
                <button
                  type="button"
                  onClick={() => window.alert("This read-only demo has no active session.")}
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            </details>
          </div>
        </header>
        <main className="mdms-content">
          <Outlet context={{ role }} />
        </main>
        <footer className="mdms-footer">
          <span>© 2026 MDMS · Meter Data Management System</span>
          <span><i /> System online <b>·</b> {configuration.workspace}</span>
        </footer>
      </div>
    </div>
  );
}

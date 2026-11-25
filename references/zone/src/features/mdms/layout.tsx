import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Gauge,
  Users,
  ChartNoAxesCombined,
  Bell,
  Settings,
  Zap,
  ChevronDown,
  ChevronRight,
  MapPin,
  PanelLeftClose,
  Menu,
  Moon,
  Sun,
  Search,
  Globe,
  LogOut,
  User,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Toaster, toast } from "sonner";
import { Modal, DetailGrid, SearchInput } from "./shared";
import { meters } from "./data";
export const navItems = [
  { title: "Dashboard", path: "/zone/dashboard", icon: LayoutDashboard },
  { title: "Meter Management", path: "/zone/meters", icon: Gauge },
  { title: "User Management", path: "/zone/users", icon: Users },
  { title: "Reports & Analytics", path: "/zone/reports", icon: ChartNoAxesCombined },
  { title: "Alerts", path: "/zone/alerts", icon: Bell },
  { title: "Settings", path: "/zone/settings", icon: Settings },
] as const;
export function AppLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const [profile, setProfile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const active = navItems.find((n) => path.startsWith(n.path));
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""} ${dark ? "dark" : ""}`}>
      <aside className={`app-sidebar ${mobile ? "mobile-open" : ""}`}>
        <Link to="/zone/dashboard" className="brand">
          <span className="brand-icon">
            <Zap size={23} fill="currentColor" />
          </span>
          <span className="brand-name">
            MDMS<span>Meter Data Management</span>
          </span>
        </Link>
        <div className="workspace">
          <span className="workspace-icon">
            <MapPin size={18} />
          </span>
          <div>
            <strong>Mangalore Zone</strong>
            <span>Zone Administrator</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              onClick={() => setMobile(false)}
              className={`nav-item ${path.startsWith(n.path) ? "active" : ""}`}
              title={n.title}
            >
              <n.icon size={19} />
              <span>{n.title}</span>
              {n.title === "Alerts" && <b>18</b>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-health">
            <ShieldCheck size={17} />
            <div>
              <strong>All systems operational</strong>
              <span>Last synced just now</span>
            </div>
            <span className="live-dot" />
          </div>
          <Button
            variant="sidebar"
            onClick={() => {
              setCollapsed(!collapsed);
              setMobile(false);
            }}
            title="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
            <span>Collapse sidebar</span>
          </Button>
        </div>
      </aside>
      {mobile && <div className="mobile-scrim" onClick={() => setMobile(false)} />}
      <div className="app-main">
        <header className="app-header">
          <div className="breadcrumb">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle sidebar"
              onClick={() => {
                if (window.innerWidth < 900) setMobile(!mobile);
                else setCollapsed(!collapsed);
              }}
            >
              <Menu />
            </Button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{active?.title ?? "Dashboard"}</strong>
          </div>
          <div className="header-tools">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search meters"
              title="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              title={dark ? "Light mode" : "Dark mode"}
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="language-button">
                  <Globe />
                  <span>EN</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>English ✓</DropdownMenuItem>
                <DropdownMenuItem>हिन्दी</DropdownMenuItem>
                <DropdownMenuItem>ಕನ್ನಡ</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="notification-button"
              title="18 unread alerts"
            >
              <Link to="/zone/alerts" aria-label="Notifications">
                <Bell />
                <span className="notification-dot" />
              </Link>
            </Button>
            <span className="header-divider" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="profile-trigger">
                  <span className="avatar">RS</span>
                  <span className="profile-copy">
                    <strong>Rahul Sharma</strong>
                    <small>Zone Administrator</small>
                  </span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setProfile(true)}>
                  <User />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/zone/settings">
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    toast.info("This read-only demo has no signed-in session to log out of.")
                  }
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>© 2026 MDMS. All rights reserved.</span>
          <span>
            <span className="live-dot" /> System online <span className="footer-separator">|</span>{" "}
            Mangalore Zone
          </span>
        </footer>
      </div>
      <Toaster position="bottom-right" richColors />
      <Modal title="Administrator Profile" open={profile} onClose={() => setProfile(false)}>
        <DetailGrid
          items={[
            ["Full name", "Rahul Sharma"],
            ["Role", "Zone Administrator"],
            ["Assigned zone", "Mangalore Zone"],
            ["Email", "rahul.sharma@mdms.in"],
          ]}
        />
      </Modal>
      <Modal title="Search Mangalore Zone" open={searchOpen} onClose={() => setSearchOpen(false)}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search meter ID or owner..."
        />
        <div className="global-results">
          {meters
            .filter((m) => (m.id + " " + m.owner).toLowerCase().includes(search.toLowerCase()))
            .slice(0, 5)
            .map((m) => (
              <Link
                key={m.id}
                to="/zone/meters/$meterId"
                params={{ meterId: m.id }}
                onClick={() => setSearchOpen(false)}
              >
                <div>
                  <strong>{m.id}</strong>
                  <span>{m.owner}</span>
                </div>
                <ArrowUpRight size={17} />
              </Link>
            ))}
        </div>
      </Modal>
    </div>
  );
}

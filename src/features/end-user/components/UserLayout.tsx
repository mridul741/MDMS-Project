
import { NavLink, Outlet } from "react-router-dom";
import "./UserLayout.css";

function UserLayout() {
  return (
    <div className="user-layout">
      <header className="user-header">
        <h2>MDMS</h2>

        <nav className="user-navigation">
          <NavLink to="/user/dashboard">Dashboard</NavLink>
          <NavLink to="/user/bills">Bills</NavLink>
          <NavLink to="/user/meter-data">Meter Data</NavLink>
          <NavLink to="/user/alerts">Alerts</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>

      <main className="user-main">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;

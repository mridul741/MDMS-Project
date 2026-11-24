
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/enterprise.css";

function EnterpriseLayout() {
  return (
    <div className="enterprise-layout">
      <Sidebar />

      <div className="enterprise-main">
        <Header />

        <main className="enterprise-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default EnterpriseLayout;

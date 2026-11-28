
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { UserRole } from "../authService";

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleHome: Record<UserRole, string> = {
    "end-user": "/user/dashboard",
    zone: "/zone/dashboard",
    enterprise: "/enterprise/dashboard",
  };

  return <Navigate to={roleHome[user.role]} replace />;
}

export default HomeRedirect;

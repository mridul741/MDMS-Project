
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { UserRole } from "../authService";

interface RequireAuthProps {
  allowedRole: UserRole;
}

function RequireAuth({ allowedRole }: RequireAuthProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    const roleHome: Record<UserRole, string> = {
      "end-user": "/user/dashboard",
      zone: "/zone/dashboard",
      enterprise: "/enterprise/dashboard",
    };

    return <Navigate to={roleHome[user.role]} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;

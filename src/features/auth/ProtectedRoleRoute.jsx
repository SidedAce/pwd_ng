import { Navigate, Outlet } from "react-router-dom";
import { useAppData } from "../app/AppDataProvider";

export function ProtectedRoleRoute({ allow }) {
  const { canAccessGm, status } = useAppData();

  if (status === "loading") {
    return null;
  }

  if (allow === "gm" && !canAccessGm) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

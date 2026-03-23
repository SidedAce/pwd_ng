import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authConfig } from "../../config/auth.config";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute() {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <main className="shell">
        <section className="panel">
          <h2>{authConfig.copy.loadingLabel}</h2>
          <p>Firebase Auth is resolving the current session before protected routes render.</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={authConfig.routeProtection.redirectUnauthedTo}
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return <Outlet />;
}

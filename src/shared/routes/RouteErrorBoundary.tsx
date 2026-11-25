import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  console.error("Route failed to load:", error);

  return (
    <main className="app-error-page">
      <section className="app-error-card" role="alert">
        <span className="app-error-icon"><AlertTriangle size={24} /></span>
        <p className="app-error-code">ERROR {status}</p>
        <h1>We couldn't load this page</h1>
        <p className="app-error-description">
          The page may be temporarily unavailable. Make sure the application server is running, then
          try again.
        </p>
        <div className="app-error-actions">
          <button type="button" className="app-error-retry" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Retry
          </button>
          <Link to="/zone/dashboard" className="app-error-home">
            <Home size={16} /> Zone dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

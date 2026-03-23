import { NavLink, Outlet } from "react-router-dom";
import { authConfig } from "../config/auth.config";
import { layoutContentConfig } from "../config/layoutContent.config";
import { navigationConfig } from "../config/navigation.config";
import { useAppData } from "../features/app/AppDataProvider";
import { useAuth } from "../features/auth/AuthProvider";
import { mockSession } from "../features/session/mockSession";

function LayoutFrame({ title, subtitle, navItems, authSlot, children }) {
  return (
    <main className="shell">
      <header className="shell-header">
        <div>
          <p className="eyebrow">PWD</p>
          <h1>{title}</h1>
          {subtitle ? <p className="lede">{subtitle}</p> : null}
        </div>
        <section className="summary-chip-row">
          <article className="summary-chip">
            <span className="label">Session</span>
            <strong>{mockSession.name}</strong>
          </article>
          <article className="summary-chip">
            <span className="label">Day</span>
            <strong>{mockSession.currentDay}</strong>
          </article>
        </section>
      </header>

      {navItems?.length ? (
        <div className="top-nav-row">
          <nav className="top-nav" aria-label={`${title} navigation`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {authSlot ? <div className="auth-slot">{authSlot}</div> : null}
        </div>
      ) : null}

      {children ?? <Outlet />}
    </main>
  );
}

export function PublicLayout() {
  const { isAuthenticated, logOut, user } = useAuth();

  return (
    <LayoutFrame
      title={layoutContentConfig.public.title}
      subtitle={layoutContentConfig.public.subtitle}
      navItems={navigationConfig.public}
      authSlot={
        isAuthenticated ? (
          <div className="auth-actions">
            <span className="auth-label">{user?.displayName || user?.email}</span>
            <button className="utility-button" type="button" onClick={logOut}>
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="utility-button utility-link">
            Login
          </NavLink>
        )
      }
    />
  );
}

export function AppLayout() {
  const { user, logOut } = useAuth();
  const { activeSession, canAccessGm, canSelfRevokeGmElevation, clearAdminElevation, error, profile, status } = useAppData();
  const displayName = user?.displayName || user?.email || mockSession.currentUser.displayName;
  const appNavItems = canAccessGm ? navigationConfig.app : navigationConfig.app.filter((item) => item.to !== "/app/gm");
  const sessionName = activeSession?.name || "No active session";
  const currentDay = activeSession?.currentDay ?? mockSession.currentDay;

  return (
    <LayoutFrame
      title={layoutContentConfig.app.title}
      subtitle={`${layoutContentConfig.app.subtitlePrefix} ${displayName}. ${layoutContentConfig.app.subtitleSuffix}`}
      navItems={appNavItems}
      authSlot={
        <div className="auth-actions">
          <span className="auth-label">{displayName}</span>
          {canSelfRevokeGmElevation ? (
            <button className="utility-button decision-reject" type="button" onClick={clearAdminElevation}>
              {authConfig.copy.removeElevationLabel}
            </button>
          ) : null}
          <button className="utility-button" type="button" onClick={logOut}>
            Logout
          </button>
        </div>
      }
    >
      <section className="section-stack">
        <div className="panel utility-bar">
          <div>
            <span className="label">Active Session</span>
            <strong>{sessionName}</strong>
            <p className="support-copy utility-copy">Day {currentDay}</p>
          </div>
          <div>
            <span className="label">Data Status</span>
            <strong>{status}</strong>
            {error ? <p className="error-copy utility-copy">{error}</p> : null}
          </div>
        </div>
        <Outlet />
      </section>
    </LayoutFrame>
  );
}

export function NationLayout() {
  const { activeNation } = useAppData();
  const nationName = activeNation?.name || mockSession.nation.name;

  return (
    <section className="section-stack">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow-inline">{layoutContentConfig.nation.eyebrow}</p>
            <h2>{nationName}</h2>
          </div>
          <p className="soft-copy">{layoutContentConfig.nation.subtitle}</p>
        </div>
        <nav className="sub-nav" aria-label="Nation navigation">
          {navigationConfig.nation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </section>
  );
}

export function GmLayout() {
  const { profile } = useAppData();

  return (
    <section className="section-stack">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow-inline">{layoutContentConfig.gm.eyebrow}</p>
            <h2>{layoutContentConfig.gm.title}</h2>
          </div>
          <p className="soft-copy">{layoutContentConfig.gm.subtitle} Current profile role: {profile?.globalRole || "unknown"}.</p>
        </div>
        <nav className="sub-nav" aria-label="GM navigation">
          {navigationConfig.gm.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </section>
  );
}

import { NavLink, Outlet } from "react-router-dom";
import { authConfig } from "../config/auth.config";
import { layoutContentConfig } from "../config/layoutContent.config";
import { navigationConfig } from "../config/navigation.config";
import { shellSummaryConfig } from "../config/shellSummary.config";
import { useAppData } from "../features/app/AppDataProvider";
import { useAuth } from "../features/auth/AuthProvider";
import { mockSession } from "../features/session/mockSession";

function LayoutFrame({ title, subtitle, navItems, authSlot, summarySessionName, summaryDay, children }) {
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
            <strong>{summarySessionName}</strong>
          </article>
          <article className="summary-chip">
            <span className="label">Day</span>
            <strong>{summaryDay}</strong>
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
      summarySessionName={shellSummaryConfig.fallbackSessionName}
      summaryDay={shellSummaryConfig.fallbackDay}
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
  const appNavItems = navigationConfig.app.filter((item) => !item.requiresGm || canAccessGm);
  const sessionName = activeSession?.name || shellSummaryConfig.fallbackSessionName;
  const currentDay = activeSession?.currentDay ?? shellSummaryConfig.fallbackDay;

  return (
    <LayoutFrame
      title={layoutContentConfig.app.title}
      subtitle={`${layoutContentConfig.app.subtitlePrefix} ${displayName}. ${layoutContentConfig.app.subtitleSuffix}`}
      navItems={appNavItems}
      summarySessionName={sessionName}
      summaryDay={currentDay}
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
        {error ? (
          <div className="panel">
            <span className="label">Data Status</span>
            <strong>{status}</strong>
            <p className="error-copy utility-copy">{error}</p>
          </div>
        ) : null}
        <Outlet />
      </section>
    </LayoutFrame>
  );
}

export function NationLayout() {
  const { activeNation, canAccessGm } = useAppData();
  const nationName = activeNation?.name || (canAccessGm ? "Nation Workspace" : "No Active Nation");
  const nationNavItems = navigationConfig.nation.filter(
    (item) => (!item.requiresGm || canAccessGm) && (!item.requiresNation || Boolean(activeNation)),
  );

  return (
    <section className="section-stack">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow-inline">{layoutContentConfig.nation.eyebrow}</p>
            <h2>{nationName}</h2>
          </div>
          <p className="soft-copy">
            {activeNation ? layoutContentConfig.nation.subtitle : "Player nation routes appear here once you have an active nation membership."}
          </p>
        </div>
        <nav className="sub-nav" aria-label="Nation navigation">
          {nationNavItems.map((item) => (
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

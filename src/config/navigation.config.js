// Route-aware navigation lives here so future structure changes stay declarative.
export const navigationConfig = {
  public: [
    { to: "/", label: "Home", end: true },
    { to: "/request-access", label: "Request Access" },
  ],
  app: [
    { to: "/app", label: "Overview", end: true },
    { to: "/app/profile", label: "Profile" },
    { to: "/app/session-select", label: "Sessions" },
    { to: "/app/events", label: "Events" },
    { to: "/app/actions", label: "Actions" },
    { to: "/app/nation", label: "Nation" },
    { to: "/app/gm", label: "GM" },
  ],
  nation: [
    { to: "/app/nation/overview", label: "Overview" },
    { to: "/app/nation/provinces", label: "Provinces" },
    { to: "/app/nation/structures", label: "Structures" },
    { to: "/app/nation/production", label: "Production" },
    { to: "/app/nation/assets", label: "Assets" },
    { to: "/app/nation/formations", label: "Formations" },
  ],
  gm: [
    { to: "/app/gm", label: "Dashboard", end: true },
    { to: "/app/gm/actions", label: "Action Queue" },
    { to: "/app/gm/nations", label: "Nations" },
    { to: "/app/gm/reports", label: "Reports" },
  ],
};

// Route-aware navigation lives here so future structure changes stay declarative.
export const navigationConfig = {
  public: [
    { to: "/", label: "Home", end: true },
    { to: "/app", label: "Command Shell" },
    { to: "/request-access", label: "Request Access" },
  ],
  app: [
    { to: "/", label: "Home", end: true },
    { to: "/app", label: "Command Shell", end: true },
    { to: "/app/profile", label: "Profile" },
    { to: "/app/session-select", label: "Sessions" },
    { to: "/app/events", label: "Events" },
    { to: "/app/actions", label: "Actions", requiresGm: true },
    { to: "/app/nation", label: "Nation" },
  ],
  nation: [
    { to: "/app/nation/overview", label: "Overview", requiresNation: true },
    { to: "/app/nation/provinces", label: "Provinces", requiresNation: true },
    { to: "/app/nation/structures", label: "Structures", requiresNation: true },
    { to: "/app/nation/production", label: "Production", requiresNation: true },
    { to: "/app/nation/assets", label: "Assets", requiresNation: true },
    { to: "/app/nation/formations", label: "Formations", requiresNation: true },
    { to: "/app/nation/reports", label: "Reports" },
    { to: "/app/nation/admin", label: "Administration", requiresGm: true },
  ],
};

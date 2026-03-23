// A single route manifest makes it easier to keep URL structure visible and
// documented before auth and data loading become more complex.
export const routeManifestConfig = {
  public: {
    home: "/",
    login: "/login",
    requestAccess: "/request-access",
  },
  shared: {
    appHome: "/app",
    profile: "/app/profile",
    sessionSelect: "/app/session-select",
    events: "/app/events",
    actions: "/app/actions",
  },
  nation: {
    root: "/app/nation",
    overview: "/app/nation/overview",
    provinces: "/app/nation/provinces",
    structures: "/app/nation/structures",
    production: "/app/nation/production",
    assets: "/app/nation/assets",
    formations: "/app/nation/formations",
    reports: "/app/nation/reports",
    admin: "/app/nation/admin",
  },
  gm: {
    root: "/app/gm",
    actions: "/app/gm/actions",
    nations: "/app/gm/nations",
    reports: "/app/gm/reports",
  },
};

// Authentication stays configurable so provider choices and messaging can
// change without touching every component that consumes auth state.
export const authConfig = {
  providers: {
    google: {
      id: "google",
      label: "Continue With Google",
      enabled: true,
      popup: true,
    },
  },
  routeProtection: {
    redirectUnauthedTo: "/login",
    redirectAuthedTo: "/app",
  },
  adminKeyAccess: {
    enabled: true,
    staticKey: "246810",
    requiredDigits: 6,
    elevatedRole: "admin",
    source: "admin_key",
  },
  copy: {
    loginTitle: "Sign In",
    loginBody:
      "Sign in with Firebase Auth to enter the PWD command shell. Google sign-in is enabled first so we can move quickly through the foundation phase.",
    loginHelp:
      "If sign-in fails, confirm the Google provider is enabled in Firebase Authentication for project npwd-d28a4.",
    adminKeyTitle: "GM Elevation Key",
    adminKeyBody:
      "After signing in, enter the configured 6-digit admin key to temporarily elevate this account into GM access for the current profile.",
    adminKeyPlaceholder: "Enter 6-digit GM key",
    adminKeyPrompt: "Sign in first, then enter the GM key if you need elevated access.",
    adminKeySuccess: "GM elevation granted for this profile.",
    adminKeyRemoved: "GM elevation removed. This profile is back on its base role.",
    adminKeyInvalid: "That GM key did not match the configured value.",
    adminKeyFormatError: "Enter the full 6-digit GM key.",
    removeElevationLabel: "Drop GM Access",
    loadingLabel: "Checking authentication status...",
  },
};

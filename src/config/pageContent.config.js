import { gameConfig } from "./game.config";

// Page content is intentionally declarative. This keeps layout components
// generic and puts most early product tuning in one place.
export const pageContentConfig = {
  publicHome: {
    title: "Starter Site",
    body: "The live site is now running on Firebase Hosting. This front page is the public entry point while the app grows into the full campaign management platform.",
    ctas: [
      {
        to: "/login",
        title: "Login",
        body: "Reserved for Firebase Auth integration in the next slice.",
      },
      {
        to: "/request-access",
        title: "Request Access",
        body: "Future nation and session entry path for players.",
      },
      {
        to: "/app",
        title: "Open App Shell",
        body: "View the player and GM route structure that Phase 1 now exposes.",
      },
    ],
  },
  login: {
    title: "Login Placeholder",
    body: "This route is reserved for Firebase Auth. The next implementation step will replace this panel with the real sign-in flow and authenticated session bootstrap.",
  },
  requestAccess: {
    title: "Request Access",
    body: "The nation application is for players who want to lead their own nation. Players who want to join an existing nation should use the separate join request flow.",
    signInPrompt: "Sign in first so your request can be attached to a real player profile.",
    sessionPrompt: "Choose a public session to submit the nation request into.",
    emptySessions:
      "No public sessions are available right now. Create or expose a session in Firestore by setting `isPublicJoinEnabled` to true.",
    submitLabel: "Submit Nation Request",
    successTitle: "Request Submitted",
    successBody: "The nation request is now stored in `actions` and should appear in your action history immediately.",
    createNationTitle: "Lead Your Own Nation",
    createNationBody:
      "Use this application if you want to lead a brand-new nation. Your authenticated account is treated as the requesting primary leader automatically.",
    joinNationTitle: "Join An Existing Nation",
    joinNationBody:
      "Use this request if you want to join a nation that already exists in the selected session. This is the right path for assistants and secondary leadership roles.",
    joinEmptyState:
      "No existing nations are available to join in the selected session yet. The demo seed should create one placeholder nation for testing.",
  },
  appHome: {
    title: "Phase 1 Shell",
    body: "The shared shell now supports account, session, player, and GM navigation. That gives us stable URLs and layouts before wiring real auth and Firestore data.",
    nextTargets: [
      "Firebase Auth sign-in and sign-out flow",
      "Session selection backed by Firestore",
      "Nation request creation flow",
      "Role-aware route protection",
    ],
  },
  profile: {
    title: "Profile",
    authModeLabel: "Placeholder until Firebase Auth is wired",
  },
  sessions: {
    title: "Session Select",
    body: "Select the active campaign context for the rest of the app shell. This page now reads session membership data from Firestore.",
    emptyState:
      "No active session memberships were found yet. Once sessions and nation memberships exist in Firestore, they will appear here automatically.",
  },
  events: {
    title: "Event Feed",
    points: [
      "Economic tick processing view will live here.",
      "GM-injected world events will appear here.",
      "Player visibility filtering will be added with security-backed reads.",
    ],
  },
  actions: {
    title: "Action History",
    emptyState: "No actions found yet. Submit a nation request to create the first player-visible action record.",
  },
  nationOverview: {
    title: "Nation Overview",
  },
  provinces: {
    title: "Provinces",
    body: "Province ownership and slot capacity views will land here first when the world-state layer is wired.",
  },
  structures: {
    title: "Structures",
    body: "Structure lists and placement actions will attach to this route in the next implementation phases.",
  },
  production: {
    title: "Production",
    body: "Production queues, facility availability, and timers will be presented here.",
  },
  assets: {
    title: "Assets",
    body: "Nation asset inventory and visibility-aware asset summaries will appear here.",
  },
  formations: {
    title: "Formations",
    body: "Formation creation, asset assignment, and movement controls will be built on this route.",
  },
  gmDashboard: {
    title: "GM Dashboard",
  },
  gmActions: {
    title: "GM Action Queue",
    body: "Every application decision should run through this panel. Expand a request, review the payload, and approve or reject it with a clear audit trail.",
    emptyState: "No reviewable applications are currently in the GM queue.",
  },
  gmNations: {
    title: "Nation Administration",
    body: "Nation approval, ownership, and emergency override tools will live here.",
  },
  gmReports: {
    title: "Reports",
    body: "Economy, infrastructure, and force comparison reports will be generated from this surface.",
  },
};

// Bootstrap rules for early Firestore-backed identity.
// This lets us control initial role assignment and local selection behavior
// without burying those assumptions in provider code.
export const bootstrapConfig = {
  usersCollection: "users",
  nationMembershipsCollection: "nationMemberships",
  sessionsCollection: "sessions",
  nationsCollection: "nations",
  defaultGlobalRole: "player",
  gmRoles: ["gm", "admin"],
  localStorageKeys: {
    activeSessionId: "pwd.activeSessionId",
  },
};

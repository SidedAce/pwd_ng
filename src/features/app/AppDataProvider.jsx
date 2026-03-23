import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { authConfig } from "../../config/auth.config";
import { bootstrapConfig } from "../../config/bootstrap.config";
import { demoConfig } from "../../config/demo.config";
import { db } from "../../lib/firebase";
import { useAuth } from "../auth/AuthProvider";

const AppDataContext = createContext(null);

function getBootstrapRole(email) {
  return bootstrapConfig.defaultGlobalRole;
}

function resolveElevationState(profileData) {
  return {
    isActive: Boolean(profileData?.gmElevation?.isActive),
    source: profileData?.gmElevation?.source || "",
    grantedAt: profileData?.gmElevation?.grantedAt || null,
  };
}

function resolveBaseRole(profileData, user) {
  return profileData?.baseGlobalRole || profileData?.globalRole || getBootstrapRole(user?.email);
}

function buildEffectiveRole(baseGlobalRole, gmElevation) {
  if (gmElevation?.isActive) {
    return authConfig.adminKeyAccess.elevatedRole;
  }

  return baseGlobalRole;
}

async function ensureUserProfile(user) {
  const userRef = doc(db, bootstrapConfig.usersCollection, user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    const baseGlobalRole = getBootstrapRole(user.email);
    const gmElevation = {
      isActive: false,
      source: "",
      grantedAt: null,
    };

    await setDoc(userRef, {
      displayName: user.displayName || user.email || "Unnamed User",
      email: user.email || "",
      photoUrl: user.photoURL || "",
      baseGlobalRole,
      globalRole: buildEffectiveRole(baseGlobalRole, gmElevation),
      gmElevation,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    const existingData = existing.data();
    const baseGlobalRole =
      existingData?.gmElevation?.isActive || existingData?.baseGlobalRole === bootstrapConfig.defaultGlobalRole
        ? resolveBaseRole(existingData, user)
        : bootstrapConfig.defaultGlobalRole;
    const gmElevation = resolveElevationState(existingData);

    await setDoc(
      userRef,
      {
        displayName: user.displayName || existingData.displayName || user.email || "Unnamed User",
        email: user.email || existingData.email || "",
        photoUrl: user.photoURL || existingData.photoUrl || "",
        baseGlobalRole,
        globalRole: buildEffectiveRole(baseGlobalRole, gmElevation),
        gmElevation,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  const resolved = await getDoc(userRef);

  return {
    id: resolved.id,
    ...resolved.data(),
  };
}

async function ensureDemoSeed(profile) {
  if (!demoConfig.enabled) {
    return;
  }

  await Promise.all(
    demoConfig.sessions.map(async (session) => {
      const sessionRef = doc(db, bootstrapConfig.sessionsCollection, session.id);
      const sessionSnap = await getDoc(sessionRef);

      if (!sessionSnap.exists()) {
        await setDoc(sessionRef, {
          ...session.data,
          createdBy: profile.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(
          sessionRef,
          {
            ...session.data,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    }),
  );

  await Promise.all(
    demoConfig.nations.map(async (nation) => {
      const nationRef = doc(db, bootstrapConfig.nationsCollection, nation.id);
      const nationSnap = await getDoc(nationRef);

      if (!nationSnap.exists()) {
        await setDoc(nationRef, {
          ...nation.data,
          sessionId: nation.sessionId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(
          nationRef,
          {
            ...nation.data,
            sessionId: nation.sessionId,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    }),
  );
}

async function loadMembershipBundle(userId) {
  const membershipsRef = collection(db, bootstrapConfig.nationMembershipsCollection);
  const membershipSnapshot = await getDocs(membershipsRef);

  const memberships = membershipSnapshot.docs
    .map((membershipDoc) => ({
      id: membershipDoc.id,
      ...membershipDoc.data(),
    }))
    .filter((membership) => membership.userId === userId && membership.status === "active");

  const sessionEntries = await Promise.all(
    memberships.map(async (membership) => {
      const sessionSnap = await getDoc(doc(db, bootstrapConfig.sessionsCollection, membership.sessionId));
      const nationSnap = membership.nationId
        ? await getDoc(doc(db, bootstrapConfig.nationsCollection, membership.nationId))
        : null;

      return {
        id: membership.sessionId,
        membership,
        session: sessionSnap.exists() ? { id: sessionSnap.id, ...sessionSnap.data() } : null,
        nation: nationSnap?.exists() ? { id: nationSnap.id, ...nationSnap.data() } : null,
      };
    }),
  );

  return sessionEntries.filter((entry) => entry.session);
}

export function AppDataProvider({ children }) {
  const { user, isAuthenticated, status: authStatus } = useAuth();
  const [profile, setProfile] = useState(null);
  const [sessionEntries, setSessionEntries] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(bootstrapConfig.localStorageKeys.activeSessionId);
    if (stored) {
      setActiveSessionId(stored);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setSessionEntries([]);
      setError("");
      setStatus(authStatus === "loading" ? "loading" : "idle");
      return;
    }

    let cancelled = false;

    async function bootstrap() {
      setStatus("loading");
      setError("");

      try {
        const nextProfile = await ensureUserProfile(user);
        await ensureDemoSeed(nextProfile);
        const nextEntries = await loadMembershipBundle(user.uid);

        if (cancelled) {
          return;
        }

        setProfile(nextProfile);
        setSessionEntries(nextEntries);

        const preferredSessionId =
          nextEntries.find((entry) => entry.id === activeSessionId)?.id || nextEntries[0]?.id || "";

        setActiveSessionId(preferredSessionId);

        if (typeof window !== "undefined") {
          if (preferredSessionId) {
            window.localStorage.setItem(bootstrapConfig.localStorageKeys.activeSessionId, preferredSessionId);
          } else {
            window.localStorage.removeItem(bootstrapConfig.localStorageKeys.activeSessionId);
          }
        }

        setStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setError(nextError.message || "Unable to load user profile and session data.");
        setStatus("error");
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [activeSessionId, authStatus, isAuthenticated, user]);

  function selectSession(sessionId) {
    setActiveSessionId(sessionId);

    if (typeof window !== "undefined") {
      if (sessionId) {
        window.localStorage.setItem(bootstrapConfig.localStorageKeys.activeSessionId, sessionId);
      } else {
        window.localStorage.removeItem(bootstrapConfig.localStorageKeys.activeSessionId);
      }
    }
  }

  async function elevateWithAdminKey(adminKey) {
    if (!user?.uid) {
      throw new Error(authConfig.copy.adminKeyPrompt);
    }

    const normalizedKey = String(adminKey || "").trim();
    const expectedLength = authConfig.adminKeyAccess.requiredDigits;

    if (!new RegExp(`^\\d{${expectedLength}}$`).test(normalizedKey)) {
      throw new Error(authConfig.copy.adminKeyFormatError);
    }

    if (normalizedKey !== authConfig.adminKeyAccess.staticKey) {
      throw new Error(authConfig.copy.adminKeyInvalid);
    }

    const currentProfile = profile || (await ensureUserProfile(user));
    const baseGlobalRole = resolveBaseRole(currentProfile, user);
    const nextElevation = {
      isActive: true,
      source: authConfig.adminKeyAccess.source,
      grantedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, bootstrapConfig.usersCollection, user.uid), {
      baseGlobalRole,
      gmElevation: nextElevation,
      globalRole: buildEffectiveRole(baseGlobalRole, { isActive: true }),
      updatedAt: serverTimestamp(),
    });

    setProfile((current) => ({
      ...(current || currentProfile),
      baseGlobalRole,
      gmElevation: {
        isActive: true,
        source: authConfig.adminKeyAccess.source,
        grantedAt: new Date().toISOString(),
      },
      globalRole: authConfig.adminKeyAccess.elevatedRole,
    }));
  }

  async function clearAdminElevation() {
    if (!user?.uid || !profile?.gmElevation?.isActive || profile.gmElevation.source !== authConfig.adminKeyAccess.source) {
      return;
    }

    const baseGlobalRole = resolveBaseRole(profile, user);
    const clearedElevation = {
      isActive: false,
      source: "",
      grantedAt: null,
    };

    await updateDoc(doc(db, bootstrapConfig.usersCollection, user.uid), {
      baseGlobalRole,
      gmElevation: clearedElevation,
      globalRole: buildEffectiveRole(baseGlobalRole, clearedElevation),
      updatedAt: serverTimestamp(),
    });

    setProfile((current) => ({
      ...(current || {}),
      baseGlobalRole,
      gmElevation: clearedElevation,
      globalRole: buildEffectiveRole(baseGlobalRole, clearedElevation),
    }));
  }

  const activeEntry = sessionEntries.find((entry) => entry.id === activeSessionId) || sessionEntries[0] || null;
  const effectiveRole = buildEffectiveRole(resolveBaseRole(profile, user), resolveElevationState(profile));
  const canAccessGm = bootstrapConfig.gmRoles.includes(effectiveRole);
  const canSelfRevokeGmElevation =
    Boolean(profile?.gmElevation?.isActive) && profile?.gmElevation?.source === authConfig.adminKeyAccess.source;

  const value = useMemo(
    () => ({
      profile: profile
        ? {
            ...profile,
            globalRole: effectiveRole,
          }
        : null,
      effectiveRole,
      sessionEntries,
      activeEntry,
      activeSessionId: activeEntry?.id || "",
      activeSession: activeEntry?.session || null,
      activeNation: activeEntry?.nation || null,
      activeMembership: activeEntry?.membership || null,
      canAccessGm,
      canSelfRevokeGmElevation,
      status,
      error,
      selectSession,
      elevateWithAdminKey,
      clearAdminElevation,
    }),
    [activeEntry, canAccessGm, canSelfRevokeGmElevation, effectiveRole, error, profile, sessionEntries, status],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider.");
  }

  return context;
}

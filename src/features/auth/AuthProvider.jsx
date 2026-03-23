import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setStatus("ready");
    });

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (nextError) {
      setError(nextError.message || "Unable to sign in right now.");
    }
  }

  async function logOut() {
    setError("");

    try {
      await signOut(auth);
    } catch (nextError) {
      setError(nextError.message || "Unable to sign out right now.");
    }
  }

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: Boolean(user),
      signInWithGoogle,
      logOut,
    }),
    [error, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

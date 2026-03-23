import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function useNationDirectory(sessionId) {
  const [nations, setNations] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const snapshot = await getDocs(collection(db, "nations"));
        const nextNations = snapshot.docs
          .map((nationDoc) => ({
            id: nationDoc.id,
            ...nationDoc.data(),
          }))
          .filter((nation) => nation.status === "active" && (!sessionId || nation.sessionId === sessionId))
          .sort((left, right) => String(left.name || "").localeCompare(String(right.name || "")));

        if (cancelled) {
          return;
        }

        setNations(nextNations);
        setStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setError(nextError.message || "Unable to load nation directory.");
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return { nations, status, error };
}

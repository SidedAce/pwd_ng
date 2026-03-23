import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { gameConfig } from "../../config/game.config";
import { db } from "../../lib/firebase";

export function useUserActions(userId) {
  const [actions, setActions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setActions([]);
      setStatus("idle");
      setError("");
      return;
    }

    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const actionsRef = collection(db, gameConfig.sessionDefaults.actionWriteCollection);
        const actionsQuery = query(actionsRef, where("submittedBy", "==", userId));
        const snapshot = await getDocs(actionsQuery);
        const nextActions = snapshot.docs
          .map((actionDoc) => ({
            id: actionDoc.id,
            ...actionDoc.data(),
          }))
          .sort((left, right) => {
            const leftSeconds = left.createdAt?.seconds || 0;
            const rightSeconds = right.createdAt?.seconds || 0;
            return rightSeconds - leftSeconds;
          });

        if (cancelled) {
          return;
        }

        setActions(nextActions);
        setStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setError(nextError.message || "Unable to load action history.");
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { actions, status, error };
}

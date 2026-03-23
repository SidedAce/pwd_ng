import { useEffect, useState } from "react";
import { listActions } from "../actions/actionService";
import { getReviewableActionTypes } from "../actions/actionDefinitions";

export function useGmApplications() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const reviewableTypes = getReviewableActionTypes();
        const nextApplications = (await listActions())
          .filter((action) => reviewableTypes.includes(action.type))
          .sort((left, right) => {
            const leftSeconds = left.createdAt?.seconds || 0;
            const rightSeconds = right.createdAt?.seconds || 0;
            return rightSeconds - leftSeconds;
          });

        if (cancelled) {
          return;
        }

        setApplications(nextApplications);
        setStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setError(nextError.message || "Unable to load GM applications.");
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { applications, setApplications, status, error };
}

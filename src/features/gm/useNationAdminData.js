import { useEffect, useState } from "react";
import { listEntities } from "../actions/actionService";

export function useNationAdminData(sessionId) {
  const [nations, setNations] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const [allNations, allMemberships, allUsers] = await Promise.all([
          listEntities("nations"),
          listEntities("nationMemberships"),
          listEntities("users"),
        ]);

        if (cancelled) {
          return;
        }

        const nextNations = allNations
          .filter((nation) => !sessionId || nation.sessionId === sessionId)
          .sort((left, right) => String(left.name || "").localeCompare(String(right.name || "")));

        const nextMemberships = allMemberships.filter((membership) => !sessionId || membership.sessionId === sessionId);
        const nextUsersById = Object.fromEntries(allUsers.map((user) => [user.id, user]));

        setNations(nextNations);
        setMemberships(nextMemberships);
        setUsersById(nextUsersById);
        setStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setError(nextError.message || "Unable to load nation administration data.");
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return {
    nations,
    memberships,
    usersById,
    status,
    error,
    setNations,
    setMemberships,
  };
}

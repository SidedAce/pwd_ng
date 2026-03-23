import { ConfigCardGrid } from "../components/ConfigCardGrid";
import { BulletList, Panel, StatGrid } from "../components/PageSection";
import { authConfig } from "../config/auth.config";
import { gameConfig } from "../config/game.config";
import { pageContentConfig } from "../config/pageContent.config";
import { useAppData } from "../features/app/AppDataProvider";
import {
  createActionFormState,
  getActionDefinition,
  getActionDisplayFields,
  getActionQueueMeta,
  getActionStatusLabel,
  getActionTypeTitle,
  isReviewableAction,
  validateActionSubmission,
} from "../features/actions/actionDefinitions";
import { submitStructuredAction } from "../features/actions/actionService";
import { ACTION_TYPES } from "../features/actions/actionTypes";
import { useUserActions } from "../features/actions/useUserActions";
import { useAuth } from "../features/auth/AuthProvider";
import { processApplicationDecision } from "../features/gm/processApplicationDecision";
import { useGmApplications } from "../features/gm/useGmApplications";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, firebaseApp } from "../lib/firebase";
import { formatTimestamp } from "../lib/formatting";
import { mockSession } from "../features/session/mockSession";

export function HomePage() {
  const firebaseStatus = firebaseApp?.name ? "Configured" : "Unavailable";

  return (
    <section className="section-stack">
      <Panel title={pageContentConfig.publicHome.title}>
        <p>{pageContentConfig.publicHome.body}</p>
        <StatGrid
          stats={[
            { label: "Firebase", value: firebaseStatus },
            { label: "Project", value: import.meta.env.VITE_FIREBASE_PROJECT_ID },
            { label: "Current Phase", value: gameConfig.app.currentPhase },
          ]}
        />
      </Panel>

      <Panel title="Immediate Paths">
        <ConfigCardGrid items={pageContentConfig.publicHome.ctas} />
      </Panel>
    </section>
  );
}

export function LoginPage() {
  const { error, isAuthenticated, signInWithGoogle, user } = useAuth();
  const { canAccessGm, canSelfRevokeGmElevation, clearAdminElevation, elevateWithAdminKey, profile } = useAppData();
  const [adminKey, setAdminKey] = useState("");
  const [adminKeyStatus, setAdminKeyStatus] = useState("idle");
  const [adminKeyMessage, setAdminKeyMessage] = useState("");

  async function handleAdminKeySubmit(event) {
    event.preventDefault();
    setAdminKeyStatus("submitting");
    setAdminKeyMessage("");

    try {
      await elevateWithAdminKey(adminKey);
      setAdminKey("");
      setAdminKeyStatus("success");
      setAdminKeyMessage(authConfig.copy.adminKeySuccess);
    } catch (nextError) {
      setAdminKeyStatus("error");
      setAdminKeyMessage(nextError.message || authConfig.copy.adminKeyInvalid);
    }
  }

  async function handleAdminKeyRemoval() {
    setAdminKeyStatus("submitting");
    setAdminKeyMessage("");

    try {
      await clearAdminElevation();
      setAdminKeyStatus("success");
      setAdminKeyMessage(authConfig.copy.adminKeyRemoved);
    } catch (nextError) {
      setAdminKeyStatus("error");
      setAdminKeyMessage(nextError.message || authConfig.copy.adminKeyRemoved);
    }
  }

  return (
    <section className="section-stack">
      <Panel title={authConfig.copy.loginTitle}>
        <p>{authConfig.copy.loginBody}</p>
        <div className="card-grid">
          <article className="action-card">
            <strong>Status</strong>
            <p>{isAuthenticated ? `Signed in as ${user?.displayName || user?.email}` : "Signed out"}</p>
          </article>
          <article className="action-card">
            <strong>Provider</strong>
            <p>{authConfig.providers.google.enabled ? "Google popup sign-in enabled" : "No provider enabled"}</p>
          </article>
          <article className="action-card">
            <strong>Role</strong>
            <p>{profile?.globalRole || "player"}</p>
            <p>GM access: {canAccessGm ? "Enabled" : "No"}</p>
          </article>
        </div>
      </Panel>

      <Panel title={pageContentConfig.login.title}>
        <button className="utility-button" type="button" onClick={signInWithGoogle} disabled={!authConfig.providers.google.enabled}>
          {authConfig.providers.google.label}
        </button>
        <p className="support-copy">{authConfig.copy.loginHelp}</p>
        {error ? <p className="error-copy">{error}</p> : null}
      </Panel>

      <Panel title={authConfig.copy.adminKeyTitle}>
        <p>{authConfig.copy.adminKeyBody}</p>
        {isAuthenticated ? (
          <form className="form-stack" onSubmit={handleAdminKeySubmit}>
            <label className="field-stack">
              <span className="label">Admin Key</span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={authConfig.adminKeyAccess.requiredDigits}
                value={adminKey}
                placeholder={authConfig.copy.adminKeyPlaceholder}
                onChange={(event) => setAdminKey(event.target.value.replace(/\D/g, "").slice(0, authConfig.adminKeyAccess.requiredDigits))}
              />
            </label>

            <div className="utility-bar">
              <div>
                <span className="label">Elevation Status</span>
                <strong>{canAccessGm ? "GM Enabled" : "Player Access"}</strong>
              </div>
              <div className="decision-row">
                <button className="utility-button" type="submit" disabled={adminKeyStatus === "submitting"}>
                  Unlock GM Access
                </button>
                {canSelfRevokeGmElevation ? (
                  <button className="utility-button decision-reject" type="button" onClick={handleAdminKeyRemoval} disabled={adminKeyStatus === "submitting"}>
                    {authConfig.copy.removeElevationLabel}
                  </button>
                ) : null}
              </div>
            </div>

            {adminKeyMessage ? (
              <p className={adminKeyStatus === "error" ? "error-copy" : "success-copy"}>{adminKeyMessage}</p>
            ) : null}
          </form>
        ) : (
          <p>{authConfig.copy.adminKeyPrompt}</p>
        )}
      </Panel>
    </section>
  );
}

export function AccessRequestPage() {
  const { isAuthenticated, user } = useAuth();
  const { profile } = useAppData();
  const createDefinition = getActionDefinition(ACTION_TYPES.REQUEST_NATION_CREATE);
  const joinDefinition = getActionDefinition(ACTION_TYPES.REQUEST_NATION_JOIN);
  const [publicSessions, setPublicSessions] = useState([]);
  const [joinableNations, setJoinableNations] = useState([]);
  const [sessionsStatus, setSessionsStatus] = useState("idle");
  const [joinableStatus, setJoinableStatus] = useState("idle");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createFormState, setCreateFormState] = useState(() => createActionFormState(ACTION_TYPES.REQUEST_NATION_CREATE));
  const [joinFormState, setJoinFormState] = useState(() => createActionFormState(ACTION_TYPES.REQUEST_NATION_JOIN));

  useEffect(() => {
    let cancelled = false;

    async function loadPublicSessions() {
      setSessionsStatus("loading");

      try {
        const sessionsRef = collection(db, "sessions");
        const snapshot = await getDocs(sessionsRef);
        const nextSessions = snapshot.docs
          .map((sessionDoc) => ({
            id: sessionDoc.id,
            ...sessionDoc.data(),
          }))
          .filter((session) => session.isPublicJoinEnabled);

        if (cancelled) {
          return;
        }

        setPublicSessions(nextSessions);
        setCreateFormState((current) => ({
          ...current,
          sessionId: current.sessionId || nextSessions[0]?.id || "",
        }));
        setJoinFormState((current) => ({
          ...current,
          sessionId: current.sessionId || nextSessions[0]?.id || "",
        }));
        setSessionsStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setSubmitError(nextError.message || "Unable to load public sessions.");
        setSessionsStatus("error");
      }
    }

    loadPublicSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!joinFormState.sessionId) {
      setJoinableNations([]);
      setJoinableStatus("idle");
      return;
    }

    let cancelled = false;

    async function loadJoinableNations() {
      setJoinableStatus("loading");

      try {
        const nationsRef = collection(db, "nations");
        const snapshot = await getDocs(nationsRef);
        const nextNations = snapshot.docs
          .map((nationDoc) => ({
            id: nationDoc.id,
            ...nationDoc.data(),
          }))
          .filter((nation) => nation.sessionId === joinFormState.sessionId && nation.status === "active");

        if (cancelled) {
          return;
        }

        setJoinableNations(nextNations);
        setJoinFormState((current) => ({
          ...current,
          targetNationId: current.targetNationId || nextNations[0]?.id || "",
        }));
        setJoinableStatus("ready");
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setSubmitError(nextError.message || "Unable to load joinable nations.");
        setJoinableStatus("error");
      }
    }

    loadJoinableNations();

    return () => {
      cancelled = true;
    };
  }, [joinFormState.sessionId]);

  function updateCreateField(fieldId, value) {
    setCreateFormState((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }

  function updateJoinField(fieldId, value) {
    setJoinFormState((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }

  function renderActionFields({ definition, formState, updateField, optionsByKey = {} }) {
    return definition.form.fields.map((field) => {
      if (field.input === "textarea") {
        return (
          <label key={field.id} className="field-stack">
            <span className="label">{field.label}</span>
            <textarea
              rows={field.rows || 4}
              value={formState[field.id]}
              placeholder={field.placeholder}
              onChange={(event) => updateField(field.id, event.target.value)}
            />
          </label>
        );
      }

      if (field.input === "select") {
        const options = optionsByKey[field.optionsKey] || [];

        return (
          <label key={field.id} className="field-stack">
            <span className="label">{field.label}</span>
            <select value={formState[field.id]} onChange={(event) => updateField(field.id, event.target.value)} disabled={!options.length}>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        );
      }

      return (
        <label key={field.id} className="field-stack">
          <span className="label">{field.label}</span>
          <input
            type="text"
            value={formState[field.id]}
            placeholder={field.placeholder}
            onChange={(event) => updateField(field.id, event.target.value)}
            readOnly={field.readOnly}
          />
        </label>
      );
    });
  }

  async function handleCreateNationSubmit(event) {
    event.preventDefault();

    if (!user?.uid) {
      setSubmitError(pageContentConfig.requestAccess.signInPrompt);
      return;
    }

    const validationError = validateActionSubmission({
      type: ACTION_TYPES.REQUEST_NATION_CREATE,
      formState: createFormState,
    });

    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitStatus("submitting");
    setSubmitError("");
    setSuccessMessage("");

    try {
      await submitStructuredAction({
        type: ACTION_TYPES.REQUEST_NATION_CREATE,
        formState: createFormState,
        user,
        profile,
        context: {
          publicSessions,
        },
      });

      setSubmitStatus("success");
      setSuccessMessage(pageContentConfig.requestAccess.successBody);
      setCreateFormState((current) => ({
        ...current,
        name: "",
        flagUrl: "",
        governmentType: "",
        ideology: "",
        lore: "",
      }));
    } catch (nextError) {
      setSubmitStatus("error");
      setSubmitError(nextError.message || "Unable to submit the nation request.");
    }
  }

  async function handleJoinNationSubmit(event) {
    event.preventDefault();

    if (!user?.uid) {
      setSubmitError(pageContentConfig.requestAccess.signInPrompt);
      return;
    }

    const validationError = validateActionSubmission({
      type: ACTION_TYPES.REQUEST_NATION_JOIN,
      formState: joinFormState,
    });

    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitStatus("submitting");
    setSubmitError("");
    setSuccessMessage("");

    try {
      await submitStructuredAction({
        type: ACTION_TYPES.REQUEST_NATION_JOIN,
        formState: joinFormState,
        user,
        profile,
        context: {
          joinableNations,
          publicSessions,
        },
      });

      setSubmitStatus("success");
      setSuccessMessage("The join request is now stored in `actions` and should appear in your action history.");
      setJoinFormState((current) => ({
        ...current,
        joinReason: "",
      }));
    } catch (nextError) {
      setSubmitStatus("error");
      setSubmitError(nextError.message || "Unable to submit the join request.");
    }
  }

  return (
    <section className="section-stack">
      <Panel title={pageContentConfig.requestAccess.title}>
        <p>{pageContentConfig.requestAccess.body}</p>
        <div className="card-grid">
          <article className="action-card">
            <strong>Authentication</strong>
            <p>{isAuthenticated ? `Signed in as ${user?.displayName || user?.email}` : pageContentConfig.requestAccess.signInPrompt}</p>
          </article>
          <article className="action-card">
            <strong>Public Sessions</strong>
            <p>{publicSessions.length ? `${publicSessions.length} session(s) available` : pageContentConfig.requestAccess.emptySessions}</p>
          </article>
          <article className="action-card">
            <strong>Joinable Nations</strong>
            <p>{joinableNations.length ? `${joinableNations.length} nation(s) visible in the selected session` : pageContentConfig.requestAccess.joinEmptyState}</p>
          </article>
        </div>
      </Panel>

      <Panel title={pageContentConfig.requestAccess.joinNationTitle}>
        <p>{pageContentConfig.requestAccess.joinNationBody}</p>
        {isAuthenticated ? (
          <form className="form-stack" onSubmit={handleJoinNationSubmit}>
            <label className="field-stack">
              <span className="label">Session</span>
              <select value={joinFormState.sessionId} onChange={(event) => updateJoinField("sessionId", event.target.value)} disabled={!publicSessions.length}>
                {publicSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </label>

            {renderActionFields({
              definition: joinDefinition,
              formState: joinFormState,
              updateField: updateJoinField,
              optionsByKey: {
                joinableNations,
              },
            })}

            <div className="utility-bar">
              <div>
                <span className="label">Joinable Nations Status</span>
                <strong>{joinableStatus}</strong>
              </div>
              <button className="utility-button" type="submit" disabled={submitStatus === "submitting" || !joinableNations.length}>
                {joinDefinition.form.submitLabel}
              </button>
            </div>
            {successMessage ? <p className="success-copy">{successMessage}</p> : null}
            {submitError ? <p className="error-copy">{submitError}</p> : null}
          </form>
        ) : (
          <p>{pageContentConfig.requestAccess.signInPrompt}</p>
        )}
      </Panel>

      <Panel title={pageContentConfig.requestAccess.createNationTitle}>
        <p>{pageContentConfig.requestAccess.createNationBody}</p>
        {isAuthenticated ? (
          <form className="form-stack" onSubmit={handleCreateNationSubmit}>
            <label className="field-stack">
              <span className="label">Session</span>
              <select value={createFormState.sessionId} onChange={(event) => updateCreateField("sessionId", event.target.value)} disabled={!publicSessions.length}>
                {publicSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </label>

            {renderActionFields({
              definition: createDefinition,
              formState: createFormState,
              updateField: updateCreateField,
            })}

            <div className="utility-bar">
              <div>
                <span className="label">Submit Status</span>
                <strong>{submitStatus === "submitting" ? "Submitting..." : sessionsStatus}</strong>
              </div>
              <button className="utility-button" type="submit" disabled={submitStatus === "submitting" || !publicSessions.length}>
                {createDefinition.form.submitLabel}
              </button>
            </div>
            {successMessage ? <p className="success-copy">{successMessage}</p> : null}
            {submitError ? <p className="error-copy">{submitError}</p> : null}
          </form>
        ) : (
          <p>{pageContentConfig.requestAccess.signInPrompt}</p>
        )}
      </Panel>
    </section>
  );
}

export function AppHomePage() {
  const { user } = useAuth();
  const { activeSession, activeNation, canAccessGm, profile, sessionEntries } = useAppData();
  const displayName = user?.displayName || user?.email || mockSession.currentUser.displayName;

  return (
    <section className="section-stack">
      <Panel title={pageContentConfig.appHome.title}>
        <p>{pageContentConfig.appHome.body}</p>
        <StatGrid
          stats={[
            { label: "User", value: displayName },
            { label: "Role", value: profile?.globalRole || mockSession.currentUser.role },
            { label: "Session Status", value: activeSession?.status || mockSession.status },
            { label: "Memberships", value: String(sessionEntries.length) },
            { label: "GM Access", value: canAccessGm ? "Enabled" : "No" },
          ]}
        />
      </Panel>
      <Panel title="Active Campaign Context">
        <StatGrid
          stats={[
            { label: "Session", value: activeSession?.name || "No active session" },
            { label: "Nation", value: activeNation?.name || "No active nation" },
          ]}
        />
      </Panel>
      <Panel title="Next Phase 1 Targets">
        <ul className="checklist">
          {pageContentConfig.appHome.nextTargets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { profile } = useAppData();

  return (
    <Panel title={pageContentConfig.profile.title}>
      <StatGrid
        stats={[
          { label: "Display Name", value: user?.displayName || mockSession.currentUser.displayName },
          { label: "Email", value: user?.email || "Unavailable" },
          { label: "Current Role", value: profile?.globalRole || mockSession.currentUser.role },
          { label: "Profile Status", value: profile?.status || "Not loaded" },
          { label: "Auth Mode", value: pageContentConfig.profile.authModeLabel },
        ]}
      />
    </Panel>
  );
}

export function SessionSelectPage() {
  const { activeSessionId, error, selectSession, sessionEntries, status } = useAppData();

  return (
    <Panel title={pageContentConfig.sessions.title}>
      <p>{pageContentConfig.sessions.body}</p>
      {sessionEntries.length ? (
        <div className="card-grid">
          {sessionEntries.map((entry) => (
            <button
              key={entry.id}
              className={`action-card action-button${activeSessionId === entry.id ? " action-button-active" : ""}`}
              type="button"
              onClick={() => selectSession(entry.id)}
            >
              <strong>{entry.session.name}</strong>
              <p>Status: {entry.session.status || "unknown"}</p>
              <p>Nation: {entry.nation?.name || "No nation linked"}</p>
              <p>Membership role: {entry.membership.role || "unknown"}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="card-grid">
          <article className="action-card">
            <strong>No Sessions Yet</strong>
            <p>{pageContentConfig.sessions.emptyState}</p>
            <p>Load status: {status}</p>
            {error ? <span className="error-copy">{error}</span> : null}
          </article>
        </div>
      )}
    </Panel>
  );
}

export function EventsPage() {
  return (
    <Panel title={pageContentConfig.events.title}>
      <BulletList items={pageContentConfig.events.points} />
    </Panel>
  );
}

export function ActionHistoryPage() {
  const { user } = useAuth();
  const { actions, error, status } = useUserActions(user?.uid);

  return (
    <Panel title={pageContentConfig.actions.title}>
      {actions.length ? (
        <div className="card-grid">
          {actions.map((action) => (
            <article key={action.id} className="action-card">
              <strong>{getActionTypeTitle(action.type)}</strong>
              <p>Status: {getActionStatusLabel(action.status)}</p>
              <p>Session: {action.sessionId || "None"}</p>
              <p>{action.validationSummary || "No summary yet."}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="card-grid">
          <article className="action-card">
            <strong>No Actions Yet</strong>
            <p>{pageContentConfig.actions.emptyState}</p>
            <p>Load status: {status}</p>
            {error ? <span className="error-copy">{error}</span> : null}
          </article>
        </div>
      )}
    </Panel>
  );
}

export function NationOverviewPage() {
  const { activeNation } = useAppData();
  const nation = activeNation || mockSession.nation;

  return (
    <Panel title={pageContentConfig.nationOverview.title}>
      <StatGrid
        stats={[
          { label: "Nation", value: nation.name || "Unknown" },
          { label: "Treasury", value: nation.treasury ?? mockSession.nation.treasury },
          { label: "Daily Income", value: nation.dailyIncome ?? mockSession.nation.dailyIncome },
          { label: "Provinces", value: nation.provinceIds?.length ?? mockSession.nation.provinces },
          { label: "Structures", value: nation.structureCount ?? mockSession.nation.structures },
        ]}
      />
    </Panel>
  );
}

export function NationProvincesPage() {
  return (
    <Panel title={pageContentConfig.provinces.title}>
      <p>{pageContentConfig.provinces.body}</p>
    </Panel>
  );
}

export function NationStructuresPage() {
  return (
    <Panel title={pageContentConfig.structures.title}>
      <p>{pageContentConfig.structures.body}</p>
    </Panel>
  );
}

export function NationProductionPage() {
  return (
    <Panel title={pageContentConfig.production.title}>
      <p>{pageContentConfig.production.body}</p>
    </Panel>
  );
}

export function NationAssetsPage() {
  return (
    <Panel title={pageContentConfig.assets.title}>
      <p>{pageContentConfig.assets.body}</p>
    </Panel>
  );
}

export function NationFormationsPage() {
  return (
    <Panel title={pageContentConfig.formations.title}>
      <p>{pageContentConfig.formations.body}</p>
    </Panel>
  );
}

export function GmDashboardPage() {
  const { profile, sessionEntries } = useAppData();
  const { applications } = useGmApplications();
  const pendingCount = applications.filter((action) => isReviewableAction(action)).length;

  return (
    <Panel title={pageContentConfig.gmDashboard.title}>
      <StatGrid
        stats={[
          { label: "Profile Role", value: profile?.globalRole || "Unknown" },
          { label: "Visible Sessions", value: String(sessionEntries.length) },
          { label: "Pending Actions", value: pendingCount },
          { label: "Review Cases", value: mockSession.gmQueue.reviewCases },
          { label: "New Events", value: mockSession.gmQueue.newEvents },
        ]}
      />
    </Panel>
  );
}

export function GmActionsPage() {
  const { user } = useAuth();
  const { applications, setApplications, status, error } = useGmApplications();
  const [decisionState, setDecisionState] = useState({
    actionId: "",
    status: "idle",
    error: "",
  });

  const reviewableApplications = applications.filter((action) => isReviewableAction(action));

  async function handleDecision(action, decision) {
    setDecisionState({
      actionId: action.id,
      status: "processing",
      error: "",
    });

    try {
      const result = await processApplicationDecision({
        action,
        decision,
        gmUserId: user?.uid || "unknown-gm",
      });

      setApplications((current) =>
        current.map((currentAction) =>
          currentAction.id === action.id
            ? {
                ...currentAction,
                status: decision === "approved" ? "approved" : "rejected",
                resolutionSummary: result.summary,
              }
            : currentAction,
        ),
      );

      setDecisionState({
        actionId: action.id,
        status: "done",
        error: "",
      });
    } catch (nextError) {
      setDecisionState({
        actionId: action.id,
        status: "error",
        error: nextError.message || "Unable to process the application decision.",
      });
    }
  }

  return (
    <Panel title={pageContentConfig.gmActions.title}>
      <p>{pageContentConfig.gmActions.body}</p>
      {reviewableApplications.length ? (
        <div className="queue-stack">
          {reviewableApplications.map((action) => (
            <details key={action.id} className="queue-card" open={reviewableApplications.length === 1}>
              <summary className="queue-summary">
                <div>
                  <strong>{getActionTypeTitle(action.type)}</strong>
                  <p>
                    Status: {getActionStatusLabel(action.status)} | Submitted: {formatTimestamp(action.createdAt)}
                  </p>
                </div>
                <span className="queue-meta">{getActionQueueMeta(action)}</span>
              </summary>

              <div className="queue-body">
                <div className="card-grid">
                  <article className="action-card">
                    <strong>Submitted By</strong>
                    <p>User ID: {action.submittedBy}</p>
                    <p>Role: {action.submittedByRole}</p>
                    <p>Session: {action.sessionId}</p>
                  </article>
                  <article className="action-card">
                    <strong>Request Summary</strong>
                    <p>{action.validationSummary || "No validation summary."}</p>
                    <p>{action.resolutionSummary || "No GM resolution yet."}</p>
                  </article>
                </div>

                <div className="payload-grid">
                  {getActionDisplayFields(action).map((field) => (
                    <article key={field.id} className="payload-card">
                      <span className="label">{field.label}</span>
                      <strong>{field.value}</strong>
                    </article>
                  ))}
                </div>

                <div className="decision-row">
                  <button
                    className="utility-button decision-approve"
                    type="button"
                    onClick={() => handleDecision(action, "approved")}
                    disabled={decisionState.status === "processing" && decisionState.actionId === action.id}
                  >
                    Approve
                  </button>
                  <button
                    className="utility-button decision-reject"
                    type="button"
                    onClick={() => handleDecision(action, "rejected")}
                    disabled={decisionState.status === "processing" && decisionState.actionId === action.id}
                  >
                    Reject
                  </button>
                </div>

                {decisionState.actionId === action.id && decisionState.status === "processing" ? (
                  <p className="support-copy">Processing GM decision...</p>
                ) : null}
                {decisionState.actionId === action.id && decisionState.status === "error" ? (
                  <p className="error-copy">{decisionState.error}</p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="card-grid">
          <article className="action-card">
            <strong>No Reviewable Applications</strong>
            <p>{pageContentConfig.gmActions.emptyState}</p>
            <p>Load status: {status}</p>
            {error ? <span className="error-copy">{error}</span> : null}
          </article>
        </div>
      )}
    </Panel>
  );
}

export function GmNationsPage() {
  return (
    <Panel title={pageContentConfig.gmNations.title}>
      <p>{pageContentConfig.gmNations.body}</p>
    </Panel>
  );
}

export function GmReportsPage() {
  return (
    <Panel title={pageContentConfig.gmReports.title}>
      <p>{pageContentConfig.gmReports.body}</p>
    </Panel>
  );
}

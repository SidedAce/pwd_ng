import { firebaseApp } from "./lib/firebase";

const firebaseStatus = firebaseApp?.name ? "Connected to Firebase app config" : "Firebase not configured";
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "Missing VITE_FIREBASE_PROJECT_ID";

const checkpoints = [
  "React app scaffolded with Vite",
  "Firebase client bootstrap added",
  "Firebase Hosting config added",
  "GitHub Actions deploy workflow ready",
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">PWD</p>
        <h1>Politics, War, Droods</h1>
        <p className="lede">
          The planning baseline is now live in code. This starter page proves the app can build, deploy, and grow
          into the campaign management platform we documented.
        </p>
        <div className="status-grid">
          <article>
            <span className="label">Firebase</span>
            <strong>{firebaseStatus}</strong>
          </article>
          <article>
            <span className="label">Project ID</span>
            <strong>{projectId}</strong>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>Starter Checklist</h2>
        <ul className="checklist">
          {checkpoints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Next Build Target</h2>
        <p>
          The natural first feature from here is authenticated access plus a session-aware app shell, followed by the
          nation request flow.
        </p>
      </section>
    </main>
  );
}

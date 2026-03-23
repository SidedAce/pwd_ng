// Layout-level copy stays separate from page content so shell wording can be
// tuned without touching route logic.
export const layoutContentConfig = {
  public: {
    title: "Politics, War, Droods",
    subtitle:
      "A persistent geopolitical campaign platform built around structured action, hidden information, and GM authority.",
  },
  app: {
    title: "Command Shell",
    subtitlePrefix: "Signed in as",
    subtitleSuffix:
      "This is the Phase 1 application shell for shared account, session, and activity surfaces.",
  },
  nation: {
    eyebrow: "Nation Space",
    subtitle: "Player-facing nation management routes are now scaffolded and ready for real data.",
  },
  gm: {
    eyebrow: "GM Operations",
    title: "Adjudication And Control",
    subtitle: "GM tools are split into review, nation administration, and reporting surfaces.",
  },
};

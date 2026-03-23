import { demoConfig } from "./demo.config";

const defaultDemoSession = demoConfig.sessions[0]?.data;

// Shared shell-summary defaults keep the top-right session chips consistent
// across public and authenticated pages until a real active session exists.
export const shellSummaryConfig = {
  fallbackSessionName: defaultDemoSession?.name || "PWD Demo Session",
  fallbackDay: defaultDemoSession?.currentDay || 1,
};

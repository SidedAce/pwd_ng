import { getDecisionHandler } from "./decisionHandlers/registry";
import { rejectAction } from "./decisionHandlers/shared";

export async function processApplicationDecision({ action, decision, gmUserId }) {
  const handler = getDecisionHandler(action.type);

  if (!handler) {
    throw new Error(`Unsupported application action type: ${action.type}`);
  }

  if (decision === "rejected") {
    return rejectAction({ action, gmUserId });
  }

  if (decision === "approved") {
    return handler.approve({ action, gmUserId });
  }

  throw new Error(`Unsupported decision: ${decision}`);
}

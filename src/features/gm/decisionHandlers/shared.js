import { createAdjudication, updateAction } from "../../actions/actionService";

export async function rejectAction({ action, gmUserId, summary = "Rejected by GM in the application panel." }) {
  await updateAction(action.id, {
    status: "rejected",
    resolutionSummary: summary,
  });

  await createAdjudication({
    action,
    decision: "rejected",
    summary,
    gmUserId,
    effects: {},
  });

  return { summary };
}

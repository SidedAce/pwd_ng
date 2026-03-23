import { createAdjudication, updateAction, upsertEntity } from "../../actions/actionService";

function buildMembershipId(sessionId, nationId, userId) {
  return `${sessionId}_${nationId}_${userId}`;
}

export const nationJoinHandler = {
  type: "REQUEST_NATION_JOIN",
  async approve({ action, gmUserId }) {
    const membershipId = buildMembershipId(action.sessionId, action.nationId, action.submittedBy);

    await upsertEntity("nationMemberships", membershipId, {
      sessionId: action.sessionId,
      nationId: action.nationId,
      userId: action.submittedBy,
      role: "viewer",
      status: "active",
    });

    const summary = "Approved by GM and converted into an active nation membership.";

    await updateAction(action.id, {
      status: "approved",
      resolutionSummary: summary,
      relatedEntityIds: [action.nationId, membershipId],
    });

    await createAdjudication({
      action,
      decision: "approved",
      summary,
      gmUserId,
      effects: {
        nationId: action.nationId,
        membershipId,
      },
    });

    return { summary };
  },
};

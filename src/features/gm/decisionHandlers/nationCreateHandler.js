import { createAdjudication, createEntity, getEntity, updateAction, upsertEntity } from "../../actions/actionService";
import { slugify } from "../../../lib/formatting";

function buildNationId(name, actionId) {
  const base = slugify(name) || "nation";
  return `${base}-${actionId.slice(0, 8)}`;
}

function buildMembershipId(sessionId, nationId, userId) {
  return `${sessionId}_${nationId}_${userId}`;
}

export const nationCreateHandler = {
  type: "REQUEST_NATION_CREATE",
  async approve({ action, gmUserId }) {
    const nationId = buildNationId(action.payload?.name, action.id);
    const existingNation = await getEntity("nations", nationId);

    if (!existingNation) {
      await createEntity("nations", nationId, {
        sessionId: action.sessionId,
        name: action.payload?.name || "Unnamed Nation",
        slug: slugify(action.payload?.name) || nationId,
        ideology: action.payload?.ideology || "",
        description: action.payload?.lore || "",
        status: "active",
        treasury: 0,
        hiddenTreasuryDelta: 0,
        publicNotes: "",
        gmNotes: "Created from GM approval panel.",
        ownerUserIds: [action.submittedBy],
        provinceIds: [],
        tags: ["player-created"],
        structureCount: 0,
        dailyIncome: 0,
        assetCount: 0,
        flagUrl: action.payload?.flagUrl || "",
        governmentType: action.payload?.governmentType || "",
      });
    }

    const membershipId = buildMembershipId(action.sessionId, nationId, action.submittedBy);

    await upsertEntity("nationMemberships", membershipId, {
      sessionId: action.sessionId,
      nationId,
      userId: action.submittedBy,
      role: "owner",
      status: "active",
    });

    const summary = "Approved by GM and converted into an active nation plus owner membership.";

    await updateAction(action.id, {
      status: "approved",
      nationId,
      resolutionSummary: summary,
      relatedEntityIds: [nationId, membershipId],
    });

    await createAdjudication({
      action,
      decision: "approved",
      summary,
      gmUserId,
      effects: {
        nationId,
        membershipId,
      },
    });

    return { summary };
  },
};

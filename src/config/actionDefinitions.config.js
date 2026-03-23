import { ACTION_TYPES } from "../features/actions/actionTypes";

// Action definitions stay declarative here so form structure, labels, queue
// visibility, and readable payload display remain easy to tune without
// rewriting route components.
export const actionDefinitionsConfig = {
  [ACTION_TYPES.REQUEST_NATION_CREATE]: {
    key: "requestNationCreate",
    type: ACTION_TYPES.REQUEST_NATION_CREATE,
    title: "Nation Creation Request",
    initialStatus: "gm_review",
    validationSummary: "Awaiting GM review",
    queueMetaField: "name",
    form: {
      submitLabel: "Submit Nation Request",
      fields: [
        {
          id: "name",
          label: "Nation Name",
          input: "text",
          placeholder: "Example: Aurelian Republic",
          required: true,
        },
        {
          id: "flagUrl",
          label: "Flag URL",
          input: "text",
          placeholder: "Paste an image URL for now. Upload support can come later.",
          required: false,
        },
        {
          id: "governmentType",
          label: "Government Type",
          input: "text",
          placeholder: "Example: Parliamentary Republic",
          required: true,
        },
        {
          id: "ideology",
          label: "Ideology",
          input: "text",
          placeholder: "Example: Constitutional Republic",
          required: true,
        },
        {
          id: "lore",
          label: "Lore",
          input: "textarea",
          placeholder: "Describe the nation concept, tone, political identity, and intended roleplay direction.",
          required: true,
          rows: 5,
        },
      ],
    },
    detailFields: [
      { id: "requesterDisplayName", label: "Requester" },
      { id: "name", label: "Nation Name" },
      { id: "flagUrl", label: "Flag URL" },
      { id: "governmentType", label: "Government Type" },
      { id: "ideology", label: "Ideology" },
      { id: "lore", label: "Lore" },
    ],
  },
  [ACTION_TYPES.REQUEST_NATION_JOIN]: {
    key: "requestNationJoin",
    type: ACTION_TYPES.REQUEST_NATION_JOIN,
    title: "Nation Join Request",
    initialStatus: "gm_review",
    validationSummary: "Awaiting GM review",
    queueMetaField: "targetNationName",
    form: {
      submitLabel: "Submit Join Request",
      fields: [
        {
          id: "targetNationId",
          label: "Target Nation",
          input: "select",
          optionsKey: "joinableNations",
          required: true,
        },
        {
          id: "joinReason",
          label: "Join Request Notes",
          input: "textarea",
          placeholder: "Explain why you want to join this nation and what role you want to fill.",
          required: true,
          rows: 4,
        },
      ],
    },
    detailFields: [
      { id: "requesterDisplayName", label: "Requester" },
      { id: "targetNationName", label: "Target Nation" },
      { id: "joinReason", label: "Join Request Notes" },
    ],
  },
};

export const actionStatusLabels = {
  pending: "Pending",
  auto_approved: "Auto-Approved",
  gm_review: "In GM Review",
  approved: "Approved",
  rejected: "Rejected",
  processed: "Processed",
  failed: "Failed",
};

export const gmQueueConfig = {
  reviewableStatuses: ["gm_review", "pending"],
  applicationTypes: [ACTION_TYPES.REQUEST_NATION_CREATE, ACTION_TYPES.REQUEST_NATION_JOIN],
};

export const actionDecisionConfig = {
  approve: "approved",
  reject: "rejected",
};

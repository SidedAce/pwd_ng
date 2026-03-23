import { actionDecisionConfig, actionDefinitionsConfig, actionStatusLabels, gmQueueConfig } from "../../config/actionDefinitions.config";
import { ACTION_TYPES } from "./actionTypes";

function getDefinition(type) {
  return actionDefinitionsConfig[type] || null;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function stringifyValue(value) {
  if (value === null || value === undefined || value === "") {
    return "None";
  }

  return String(value);
}

function getSelectedOptionLabel(options = [], id) {
  return options.find((option) => option.id === id)?.name || "";
}

function validateRequiredFields(definition, formState) {
  const missingField = definition.form.fields.find((field) => field.required && !normalizeText(formState[field.id]));
  return missingField ? `Fill in the required field: ${missingField.label}.` : "";
}

function validateNationCreate(formState) {
  if (!normalizeText(formState.sessionId)) {
    return "Choose a public session before submitting the nation request.";
  }

  return validateRequiredFields(getDefinition(ACTION_TYPES.REQUEST_NATION_CREATE), formState);
}

function validateNationJoin(formState) {
  if (!normalizeText(formState.sessionId)) {
    return "Choose a session before submitting the join request.";
  }

  return validateRequiredFields(getDefinition(ACTION_TYPES.REQUEST_NATION_JOIN), formState);
}

const submissionValidators = {
  [ACTION_TYPES.REQUEST_NATION_CREATE]: validateNationCreate,
  [ACTION_TYPES.REQUEST_NATION_JOIN]: validateNationJoin,
};

function buildNationCreatePayload({ formState, user }) {
  return {
    name: normalizeText(formState.name),
    flagUrl: normalizeText(formState.flagUrl),
    governmentType: normalizeText(formState.governmentType),
    ideology: normalizeText(formState.ideology),
    lore: normalizeText(formState.lore),
    requestedSessionId: normalizeText(formState.sessionId),
    requesterDisplayName: user?.displayName || user?.email || "Unknown Player",
  };
}

function buildNationJoinPayload({ formState, user, context }) {
  return {
    targetNationId: normalizeText(formState.targetNationId),
    targetNationName: getSelectedOptionLabel(context?.joinableNations, normalizeText(formState.targetNationId)),
    joinReason: normalizeText(formState.joinReason),
    requestedSessionId: normalizeText(formState.sessionId),
    requesterDisplayName: user?.displayName || user?.email || "Unknown Player",
  };
}

const payloadBuilders = {
  [ACTION_TYPES.REQUEST_NATION_CREATE]: buildNationCreatePayload,
  [ACTION_TYPES.REQUEST_NATION_JOIN]: buildNationJoinPayload,
};

export function getActionDefinition(type) {
  return getDefinition(type);
}

export function createActionFormState(type, overrides = {}) {
  const definition = getDefinition(type);

  if (!definition) {
    throw new Error(`Unknown action definition: ${type}`);
  }

  const baseState = definition.form.fields.reduce(
    (state, field) => ({
      ...state,
      [field.id]: field.defaultValue || "",
    }),
    { sessionId: "" },
  );

  return {
    ...baseState,
    ...overrides,
  };
}

export function validateActionSubmission({ type, formState }) {
  const validator = submissionValidators[type];
  return validator ? validator(formState) : "";
}

export function buildActionDocument({ type, formState, user, profile, context = {} }) {
  const definition = getDefinition(type);
  const payloadBuilder = payloadBuilders[type];

  if (!definition || !payloadBuilder) {
    throw new Error(`Cannot build action payload for unsupported type: ${type}`);
  }

  const payload = payloadBuilder({
    formState,
    user,
    profile,
    context,
  });

  const relatedEntityIds = [];

  if (type === ACTION_TYPES.REQUEST_NATION_JOIN && payload.targetNationId) {
    relatedEntityIds.push(payload.targetNationId);
  }

  return {
    sessionId: normalizeText(formState.sessionId),
    nationId: type === ACTION_TYPES.REQUEST_NATION_JOIN ? payload.targetNationId || null : null,
    type: definition.type,
    status: definition.initialStatus,
    submittedBy: user?.uid || "",
    submittedByRole: profile?.globalRole || "player",
    validationSummary: definition.validationSummary,
    resolutionSummary: "",
    autoApproved: false,
    requiresGmReview: true,
    relatedEntityIds,
    payload,
  };
}

export function getActionTypeTitle(type) {
  return getDefinition(type)?.title || type;
}

export function getActionStatusLabel(status) {
  return actionStatusLabels[status] || status;
}

export function getReviewableActionTypes() {
  return gmQueueConfig.applicationTypes;
}

export function getReviewableActionStatuses() {
  return gmQueueConfig.reviewableStatuses;
}

export function isReviewableAction(action) {
  return getReviewableActionTypes().includes(action.type) && getReviewableActionStatuses().includes(action.status);
}

export function getActionQueueMeta(action) {
  const definition = getDefinition(action.type);
  const queueMetaField = definition?.queueMetaField;
  return queueMetaField ? stringifyValue(action.payload?.[queueMetaField] || action.id) : action.id;
}

export function getActionDisplayFields(action) {
  const definition = getDefinition(action.type);

  if (!definition?.detailFields?.length) {
    return Object.entries(action.payload || {}).map(([id, value]) => ({
      id,
      label: id,
      value: stringifyValue(value),
    }));
  }

  return definition.detailFields.map((field) => ({
    id: field.id,
    label: field.label,
    value: stringifyValue(action.payload?.[field.id]),
  }));
}

export { actionDecisionConfig, actionDefinitionsConfig, actionStatusLabels, gmQueueConfig };

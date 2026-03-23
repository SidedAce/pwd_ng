import { ACTION_TYPES } from "../features/actions/actionTypes";
import { actionDecisionConfig, actionDefinitionsConfig, actionStatusLabels, gmQueueConfig } from "./actionDefinitions.config";

// Compatibility wrapper for older imports while the shared action-definition
// registry becomes the primary source of truth.
export const actionConfig = {
  requestNationCreate: actionDefinitionsConfig[ACTION_TYPES.REQUEST_NATION_CREATE],
  requestNationJoin: actionDefinitionsConfig[ACTION_TYPES.REQUEST_NATION_JOIN],
  labels: actionStatusLabels,
  titles: Object.fromEntries(Object.values(actionDefinitionsConfig).map((definition) => [definition.type, definition.title])),
  gmQueue: gmQueueConfig,
  decisions: actionDecisionConfig,
};

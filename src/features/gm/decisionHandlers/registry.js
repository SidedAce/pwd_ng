import { ACTION_TYPES } from "../../actions/actionTypes";
import { nationCreateHandler } from "./nationCreateHandler";
import { nationJoinHandler } from "./nationJoinHandler";

export const decisionHandlerRegistry = {
  [ACTION_TYPES.REQUEST_NATION_CREATE]: nationCreateHandler,
  [ACTION_TYPES.REQUEST_NATION_JOIN]: nationJoinHandler,
};

export function getDecisionHandler(actionType) {
  return decisionHandlerRegistry[actionType] || null;
}

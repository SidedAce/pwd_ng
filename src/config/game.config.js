// Central tuning values for the campaign framework.
// Keep gameplay constants here first so balancing changes do not require
// hunting through UI components or backend logic later.
export const gameConfig = {
  app: {
    shortName: "PWD",
    fullName: "Politics, War, Droods",
    currentPhase: "Phase 1 Foundation",
    planningModeLabel: "Specification-led development",
  },
  sessionDefaults: {
    tickTimezone: "America/New_York",
    tickHour: 0,
    currencyLabel: "USD-equivalent budget",
    actionWriteCollection: "actions",
  },
  economy: {
    cancellationRefundRate: 0.5,
    hiddenFinanceTrackingEnabled: true,
    upkeepPenaltyMode: "planned",
  },
  production: {
    requiresFacilityCapacity: true,
    autoApprovalEnabled: true,
    overflowPenaltyEnabled: true,
  },
  intelligence: {
    defaultVisibility: "hidden",
    gmControlsEstimates: true,
  },
  structures: {
    supportedTypes: [
      "factory",
      "factory_complex",
      "port",
      "drydock",
      "airbase",
      "radar",
      "space_launch_complex",
      "special_project",
    ],
  },
  actions: {
    autoApprovedTypes: [
      "PLACE_STRUCTURE",
      "START_PRODUCTION",
      "CANCEL_PRODUCTION",
      "CREATE_FORMATION",
      "UPDATE_FORMATION",
      "ASSIGN_ASSETS_TO_FORMATION",
      "REMOVE_ASSETS_FROM_FORMATION",
      "MOVE_FORMATION",
    ],
    gmReviewTypes: ["REQUEST_NATION_CREATE", "SEND_DIPLOMATIC_MESSAGE", "REQUEST_MILITARY_ACTION"],
  },
};

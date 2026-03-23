// The comparison workbench is intentionally config-driven so report categories
// and displayed fields can be tuned without redesigning the page each time.
export const nationComparisonConfig = {
  defaults: {
    left: {
      categoryId: "economy",
    },
    right: {
      categoryId: "territory",
    },
  },
  categories: [
    {
      id: "identity",
      label: "Identity",
      description: "Nation profile and high-level political framing.",
      fields: [
        { id: "name", label: "Nation Name", valueKey: "name" },
        { id: "governmentType", label: "Government Type", valueKey: "governmentType" },
        { id: "ideology", label: "Ideology", valueKey: "ideology" },
        { id: "status", label: "Status", valueKey: "status" },
      ],
    },
    {
      id: "economy",
      label: "Economy",
      description: "Treasury and financial posture for comparison work.",
      fields: [
        { id: "treasury", label: "Treasury", valueKey: "treasury" },
        { id: "dailyIncome", label: "Daily Income", valueKey: "dailyIncome" },
        { id: "hiddenTreasuryDelta", label: "Hidden Delta", valueKey: "hiddenTreasuryDelta" },
        { id: "assetCount", label: "Asset Count", valueKey: "assetCount" },
      ],
    },
    {
      id: "territory",
      label: "Territory",
      description: "Territorial footprint and infrastructure spread.",
      fields: [
        { id: "provinceCount", label: "Province Count", countKey: "provinceIds" },
        { id: "structureCount", label: "Structures", valueKey: "structureCount" },
        { id: "assetCountTerritory", label: "Assets", valueKey: "assetCount" },
        { id: "tags", label: "Tags", listKey: "tags" },
      ],
    },
    {
      id: "military",
      label: "Military",
      description: "High-level military asset quantities for quick force comparisons.",
      fields: [
        { id: "assetCount", label: "Total Assets", valueKey: "assetCount" },
        { id: "landUnits", label: "Land Units", valuePath: "militaryAssetQuantities.landUnits" },
        { id: "airUnits", label: "Air Units", valuePath: "militaryAssetQuantities.airUnits" },
        { id: "navalUnits", label: "Naval Units", valuePath: "militaryAssetQuantities.navalUnits" },
      ],
    },
    {
      id: "oversight",
      label: "Oversight",
      description: "GM-facing notes and ownership references.",
      fields: [
        { id: "ownerUserIds", label: "Owner Count", countKey: "ownerUserIds" },
        { id: "publicNotes", label: "Public Notes", valueKey: "publicNotes" },
        { id: "gmNotes", label: "GM Notes", valueKey: "gmNotes" },
        { id: "description", label: "Description", valueKey: "description" },
      ],
    },
  ],
};

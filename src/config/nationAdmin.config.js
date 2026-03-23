// Nation administration is kept configurable so status options and role labels
// can be tuned without rewriting the admin screen logic.
export const nationAdminConfig = {
  statuses: [
    { id: "active", label: "Active" },
    { id: "suspended", label: "Suspended" },
    { id: "npc", label: "NPC Controlled" },
    { id: "archived", label: "Archived" },
  ],
  membershipRoles: {
    owner: "Owner",
    viewer: "Viewer",
    officer: "Officer",
    member: "Member",
  },
  membershipStatuses: {
    active: "Active",
    pending: "Pending",
    removed: "Removed",
  },
};

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function formatTimestamp(timestamp) {
  if (!timestamp?.seconds) {
    return "No timestamp";
  }

  return new Date(timestamp.seconds * 1000).toLocaleString();
}

// Theme values stay in JavaScript so presentation tuning feels closer to
// editing config than hand-authoring CSS. CSS should mostly reference vars.
export const themeConfig = {
  colors: {
    textPrimary: "#f4f2eb",
    textMuted: "#d2d9df",
    textSoft: "#b7c2cb",
    label: "#9caab5",
    accent: "#d8be87",
    surface: "rgba(9, 15, 20, 0.72)",
    surfaceAlt: "rgba(255, 255, 255, 0.04)",
    surfaceHover: "rgba(255, 255, 255, 0.08)",
    border: "rgba(216, 190, 135, 0.22)",
    borderSoft: "rgba(216, 190, 135, 0.15)",
    borderHover: "rgba(216, 190, 135, 0.28)",
    borderActive: "rgba(216, 190, 135, 0.4)",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
  gradients: {
    pageBackground:
      "radial-gradient(circle at top, rgba(173, 132, 74, 0.32), transparent 35%), linear-gradient(160deg, #15212b 0%, #0b1218 48%, #070a0f 100%)",
  },
  spacing: {
    shellWidth: "980px",
    shellPaddingTop: "4rem",
    shellPaddingBottom: "5rem",
    panelGap: "1.25rem",
  },
  radii: {
    panel: "24px",
    panelMobile: "18px",
    pill: "999px",
    card: "18px",
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    heroSize: "clamp(2.6rem, 5vw, 4.6rem)",
    bodySize: "1.05rem",
  },
};

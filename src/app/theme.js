import { themeConfig } from "../config/theme.config";

function flattenThemeVars() {
  return {
    "--color-text-primary": themeConfig.colors.textPrimary,
    "--color-text-muted": themeConfig.colors.textMuted,
    "--color-text-soft": themeConfig.colors.textSoft,
    "--color-label": themeConfig.colors.label,
    "--color-accent": themeConfig.colors.accent,
    "--color-surface": themeConfig.colors.surface,
    "--color-surface-alt": themeConfig.colors.surfaceAlt,
    "--color-surface-hover": themeConfig.colors.surfaceHover,
    "--color-border": themeConfig.colors.border,
    "--color-border-soft": themeConfig.colors.borderSoft,
    "--color-border-hover": themeConfig.colors.borderHover,
    "--color-border-active": themeConfig.colors.borderActive,
    "--color-shadow": themeConfig.colors.shadow,
    "--gradient-page-background": themeConfig.gradients.pageBackground,
    "--shell-width": themeConfig.spacing.shellWidth,
    "--shell-padding-top": themeConfig.spacing.shellPaddingTop,
    "--shell-padding-bottom": themeConfig.spacing.shellPaddingBottom,
    "--panel-gap": themeConfig.spacing.panelGap,
    "--radius-panel": themeConfig.radii.panel,
    "--radius-panel-mobile": themeConfig.radii.panelMobile,
    "--radius-pill": themeConfig.radii.pill,
    "--radius-card": themeConfig.radii.card,
    "--font-family-base": themeConfig.typography.fontFamily,
    "--font-size-hero": themeConfig.typography.heroSize,
    "--font-size-body": themeConfig.typography.bodySize,
  };
}

export function applyThemeVars() {
  const root = document.documentElement;
  const themeVars = flattenThemeVars();

  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

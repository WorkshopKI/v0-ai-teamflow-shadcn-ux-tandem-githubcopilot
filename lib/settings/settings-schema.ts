/**
 * Settings schema and validation
 * Defines the structure and default values for application settings
 */

export interface AppSettings {
  // Typography
  fontFamily: "system" | "sans" | "roboto" | "open-sans" | "mono" | "source-code"
  fontSize: "small" | "medium" | "large"
  fontFace: "regular" | "medium" | "semibold" | "bold"

  // Colors
  primaryColor: string
  accentColor: string

  // Layout
  sidebarPosition: "left" | "right"
  spacing: "ultra-compact" | "compact" | "comfortable"
  borderRadius: "none" | "small" | "medium" | "large"

  // Theme
  theme: "light" | "dark" | "system"
}

export const defaultSettings: AppSettings = {
  fontFamily: "sans",
  fontSize: "medium",
  fontFace: "regular",
  primaryColor: "#0a3874",
  accentColor: "#306bb3",
  sidebarPosition: "left",
  spacing: "compact",
  borderRadius: "medium",
  theme: "system",
}

/**
 * Validate and merge settings with defaults
 */
export function validateSettings(settings: unknown): AppSettings {
  if (!settings || typeof settings !== "object") {
    return defaultSettings
  }

  const parsed = settings as Partial<AppSettings>

  return {
    fontFamily: ["system", "sans", "roboto", "open-sans", "mono", "source-code"].includes(parsed.fontFamily ?? "")
      ? (parsed.fontFamily as AppSettings["fontFamily"])
      : defaultSettings.fontFamily,
    fontSize: ["small", "medium", "large"].includes(parsed.fontSize ?? "")
      ? (parsed.fontSize as AppSettings["fontSize"])
      : defaultSettings.fontSize,
    fontFace: ["regular", "medium", "semibold", "bold"].includes(parsed.fontFace ?? "")
      ? (parsed.fontFace as AppSettings["fontFace"])
      : defaultSettings.fontFace,
    primaryColor:
      typeof parsed.primaryColor === "string" && /^#[0-9A-F]{6}$/i.test(parsed.primaryColor)
        ? parsed.primaryColor
        : defaultSettings.primaryColor,
    accentColor:
      typeof parsed.accentColor === "string" && /^#[0-9A-F]{6}$/i.test(parsed.accentColor)
        ? parsed.accentColor
        : defaultSettings.accentColor,
    sidebarPosition: ["left", "right"].includes(parsed.sidebarPosition ?? "")
      ? (parsed.sidebarPosition as AppSettings["sidebarPosition"])
      : defaultSettings.sidebarPosition,
    spacing: ["ultra-compact", "compact", "comfortable"].includes(parsed.spacing ?? "")
      ? (parsed.spacing as AppSettings["spacing"])
      : defaultSettings.spacing,
    borderRadius: ["none", "small", "medium", "large"].includes(parsed.borderRadius ?? "")
      ? (parsed.borderRadius as AppSettings["borderRadius"])
      : defaultSettings.borderRadius,
    theme: ["light", "dark", "system"].includes(parsed.theme ?? "")
      ? (parsed.theme as AppSettings["theme"])
      : defaultSettings.theme,
  }
}

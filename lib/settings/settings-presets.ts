/**
 * Settings presets and configuration constants
 * Centralized location for all settings-related constants
 */

export const fontPresets = [
  { id: "system" as const, name: "System Font", description: "Your device's default font", example: "System" },
  { id: "sans" as const, name: "Inter", description: "Clean and modern sans-serif", example: "Inter" },
  { id: "roboto" as const, name: "Roboto", description: "Google's signature sans-serif", example: "Roboto" },
  { id: "open-sans" as const, name: "Open Sans", description: "Friendly and readable", example: "Open Sans" },
  { id: "mono" as const, name: "JetBrains Mono", description: "Code-friendly monospace", example: "JetBrains" },
  { id: "source-code" as const, name: "Source Code Pro", description: "Adobe's monospace for code", example: "Source Code" },
]

export const colorPresets = [
  { name: "Professional Blue", primary: "#0a3874", accent: "#306bb3" },
  { name: "Forest Green", primary: "#1e5631", accent: "#4a9d5f" },
  { name: "Royal Purple", primary: "#5b21b6", accent: "#8b5cf6" },
  { name: "Sunset Orange", primary: "#c2410c", accent: "#f97316" },
  { name: "Deep Teal", primary: "#0f766e", accent: "#14b8a6" },
]

export const fontSizeMap = {
  small: "14px",
  medium: "16px",
  large: "18px",
} as const

export const fontFacePresets = [
  { id: "regular" as const, name: "Regular", weight: 400 },
  { id: "medium" as const, name: "Medium", weight: 500 },
  { id: "semibold" as const, name: "Semi Bold", weight: 600 },
  { id: "bold" as const, name: "Bold", weight: 700 },
] as const

export const fontFaceMap = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const fontFamilyMap = {
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  sans: "var(--font-sans)",
  roboto: "var(--font-roboto)",
  "open-sans": "var(--font-open-sans)",
  mono: "var(--font-mono)",
  "source-code": "var(--font-source-code)",
} as const

export const spacingMap = {
  "ultra-compact": "0.1875rem", // 3px
  compact: "0.25rem", // 4px
  comfortable: "0.375rem", // 6px
} as const

export const radiusMap = {
  none: "0",
  small: "0.25rem",
  medium: "0.5rem",
  large: "1rem",
} as const

/**
 * Calculate spacing value from settings
 */
export function getSpacingValue(spacing: keyof typeof spacingMap): string {
  return spacingMap[spacing]
}

/**
 * Calculate border radius value from settings
 */
export function getRadiusValue(borderRadius: keyof typeof radiusMap): string {
  return radiusMap[borderRadius]
}

/**
 * Calculate font size value from settings
 */
export function getFontSizeValue(fontSize: keyof typeof fontSizeMap): string {
  return fontSizeMap[fontSize]
}

/**
 * Resolve CSS font-weight from settings
 */
export function getFontFaceWeight(fontFace: keyof typeof fontFaceMap): number {
  return fontFaceMap[fontFace]
}

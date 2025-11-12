/**
 * Settings module
 * Centralized settings management for the application
 */

export { SettingsProvider, useSettings } from "./settings-context"
export type { AppSettings } from "./settings-schema"
export { defaultSettings, validateSettings } from "./settings-schema"
export {
  fontPresets,
  colorPresets,
  fontSizeMap,
  fontFacePresets,
  fontFaceMap,
  spacingMap,
  radiusMap,
  getSpacingValue,
  getRadiusValue,
  getFontSizeValue,
  getFontFaceWeight,
} from "./settings-presets"
export { useTheme, useSpacing, useColors } from "./hooks"

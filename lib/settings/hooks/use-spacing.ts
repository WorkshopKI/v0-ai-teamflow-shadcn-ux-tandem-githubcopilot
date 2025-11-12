/**
 * Hook for accessing spacing settings
 */

import { useSettings } from "../settings-context"
import { getSpacingValue, spacingMap } from "../settings-presets"

export function useSpacing() {
  const { settings, pendingSettings, updatePendingSettings } = useSettings()

  return {
    spacing: settings.spacing,
    spacingValue: getSpacingValue(settings.spacing),
    pendingSpacing: pendingSettings.spacing,
    pendingSpacingValue: getSpacingValue(pendingSettings.spacing),
    setSpacing: (spacing: keyof typeof spacingMap) => updatePendingSettings({ spacing }),
  }
}

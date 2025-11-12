/**
 * Hook for accessing color settings
 */

import { useSettings } from "../settings-context"

export function useColors() {
  const { settings, pendingSettings, updatePendingSettings } = useSettings()

  return {
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
    pendingPrimaryColor: pendingSettings.primaryColor,
    pendingAccentColor: pendingSettings.accentColor,
    setPrimaryColor: (color: string) => updatePendingSettings({ primaryColor: color }),
    setAccentColor: (color: string) => updatePendingSettings({ accentColor: color }),
    setColors: (primary: string, accent: string) =>
      updatePendingSettings({ primaryColor: primary, accentColor: accent }),
  }
}

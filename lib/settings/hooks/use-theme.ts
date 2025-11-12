/**
 * Hook for accessing theme settings
 */

import { useSettings } from "../settings-context"

export function useTheme() {
  const { settings, pendingSettings, updatePendingSettings } = useSettings()

  return {
    theme: settings.theme,
    pendingTheme: pendingSettings.theme,
    setTheme: (theme: "light" | "dark" | "system") => updatePendingSettings({ theme }),
  }
}

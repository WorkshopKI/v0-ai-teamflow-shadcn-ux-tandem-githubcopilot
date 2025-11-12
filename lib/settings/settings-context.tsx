"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { type AppSettings, defaultSettings, validateSettings } from "./settings-schema"
import { fontSizeMap, fontFamilyMap, spacingMap, radiusMap, fontFaceMap } from "./settings-presets"

interface SettingsContextType {
  settings: AppSettings
  pendingSettings: AppSettings
  updatePendingSettings: (settings: Partial<AppSettings>) => void
  applySettings: () => void
  resetSettings: () => void
  hasChanges: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [pendingSettings, setPendingSettings] = useState<AppSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from storage on mount
  useEffect(() => {
    const savedSettings = storage.get(STORAGE_KEYS.APP_SETTINGS, null)
    if (savedSettings) {
      try {
        const loadedSettings = validateSettings(savedSettings)
        setSettings(loadedSettings)
        setPendingSettings(loadedSettings)
      } catch (error) {
        console.error("[Settings] Failed to load settings:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Apply settings to CSS when they change
  useEffect(() => {
    if (isLoaded) {
      applyCSSSettings(settings)
    }
  }, [settings, isLoaded])

  const updatePendingSettings = (newSettings: Partial<AppSettings>) => {
    setPendingSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const applySettings = () => {
    setSettings(pendingSettings)
    storage.set(STORAGE_KEYS.APP_SETTINGS, pendingSettings)
    console.log("[Settings] Settings applied:", pendingSettings)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setPendingSettings(defaultSettings)
    storage.remove(STORAGE_KEYS.APP_SETTINGS)
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(pendingSettings)

  return (
    <SettingsContext.Provider
      value={{ settings, pendingSettings, updatePendingSettings, applySettings, resetSettings, hasChanges }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

/**
 * Apply settings to CSS variables
 */
function applyCSSSettings(settings: AppSettings) {
  const root = document.documentElement

  // Colors - directly update the theme variables
  root.style.setProperty("--primary", settings.primaryColor)
  root.style.setProperty("--accent", settings.accentColor)
  root.style.setProperty("--ring", settings.primaryColor)
  root.style.setProperty("--sidebar-primary", settings.primaryColor)
  root.style.setProperty("--sidebar-ring", settings.primaryColor)

  // Font family
  root.style.setProperty("--active-font-family", fontFamilyMap[settings.fontFamily])

  // Font face / weight
  root.style.setProperty("--active-font-weight", String(fontFaceMap[settings.fontFace]))

  // Font size
  root.style.setProperty("--base-font-size", fontSizeMap[settings.fontSize])

  // Spacing
  root.style.setProperty("--spacing", spacingMap[settings.spacing])

  // Border radius
  root.style.setProperty("--radius", radiusMap[settings.borderRadius])

  // Sidebar position
  root.setAttribute("data-sidebar-position", settings.sidebarPosition)

  console.log("[Settings] Applied CSS settings:")
  console.log("  - Font Family:", settings.fontFamily, "→ var(--font-" + settings.fontFamily + ")")
  console.log("  - Font Size:", settings.fontSize, "→", fontSizeMap[settings.fontSize])
  console.log("  - Font Face:", settings.fontFace, "→", fontFaceMap[settings.fontFace])
  console.log("  - Primary:", settings.primaryColor)
  console.log("  - Accent:", settings.accentColor)
}

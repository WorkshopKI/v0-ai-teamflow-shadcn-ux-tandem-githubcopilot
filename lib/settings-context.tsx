"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface AppSettings {
  // Typography
  fontFamily: "sans" | "serif" | "mono"
  fontSize: "small" | "medium" | "large"

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

const defaultSettings: AppSettings = {
  fontFamily: "sans",
  fontSize: "medium",
  primaryColor: "#0a3874",
  accentColor: "#306bb3",
  sidebarPosition: "left",
  spacing: "comfortable",
  borderRadius: "medium",
  theme: "system",
}

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        const loadedSettings = { ...defaultSettings, ...parsed }
        setSettings(loadedSettings)
        setPendingSettings(loadedSettings)
      } catch (error) {
        console.error("[v0] Failed to load settings:", error)
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
    localStorage.setItem("appSettings", JSON.stringify(pendingSettings))
    console.log("[v0] Settings applied:", pendingSettings)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setPendingSettings(defaultSettings)
    localStorage.removeItem("appSettings")
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

// Apply settings to CSS variables
function applyCSSSettings(settings: AppSettings) {
  const root = document.documentElement

  // Font family
  root.style.setProperty("--active-font-family", `var(--font-${settings.fontFamily})`)

  // Font size
  const fontSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
  }
  root.style.setProperty("--base-font-size", fontSizeMap[settings.fontSize])

  // Colors
  root.style.setProperty("--custom-primary", settings.primaryColor)
  root.style.setProperty("--custom-accent", settings.accentColor)

  // Spacing
  const spacingMap = {
    "ultra-compact": "0.125rem",
    compact: "0.25rem",
    comfortable: "0.5rem",
  }
  root.style.setProperty("--custom-spacing", spacingMap[settings.spacing])

  // Border radius
  const radiusMap = {
    none: "0",
    small: "0.25rem",
    medium: "0.5rem",
    large: "1rem",
  }
  root.style.setProperty("--custom-radius", radiusMap[settings.borderRadius])

  // Sidebar position
  root.setAttribute("data-sidebar-position", settings.sidebarPosition)
}

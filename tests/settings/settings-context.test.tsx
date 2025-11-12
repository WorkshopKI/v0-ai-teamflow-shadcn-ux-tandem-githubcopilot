/**
 * Tests for settings context
 * Verifies pending/applied state management and persistence
 */

import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { renderHook, act } from "@testing-library/react"
import { SettingsProvider, useSettings, defaultSettings, type AppSettings } from "@/lib/settings"
import { storage, STORAGE_KEYS } from "@/lib/storage"

// Mock the storage module
vi.mock("@/lib/storage", () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
  STORAGE_KEYS: {
    APP_SETTINGS: "appSettings",
  },
}))

describe("SettingsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should provide default settings on initial load", () => {
    vi.mocked(storage.get).mockReturnValue(null)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    expect(result.current.settings).toEqual(defaultSettings)
    expect(result.current.pendingSettings).toEqual(defaultSettings)
    expect(result.current.hasChanges).toBe(false)
  })

  it("should load saved settings from storage", () => {
    const savedSettings: AppSettings = {
      ...defaultSettings,
      primaryColor: "#ff0000",
      fontSize: "large",
    }

    vi.mocked(storage.get).mockReturnValue(savedSettings)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    waitFor(() => {
      expect(result.current.settings).toEqual(savedSettings)
      expect(result.current.pendingSettings).toEqual(savedSettings)
    })
  })

  it("should update pending settings without affecting applied settings", () => {
    vi.mocked(storage.get).mockReturnValue(null)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    act(() => {
      result.current.updatePendingSettings({ primaryColor: "#00ff00" })
    })

    expect(result.current.settings.primaryColor).toBe(defaultSettings.primaryColor)
    expect(result.current.pendingSettings.primaryColor).toBe("#00ff00")
    expect(result.current.hasChanges).toBe(true)
  })

  it("should apply pending settings and persist to storage", () => {
    vi.mocked(storage.get).mockReturnValue(null)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    act(() => {
      result.current.updatePendingSettings({ primaryColor: "#0000ff", fontSize: "small" })
    })

    act(() => {
      result.current.applySettings()
    })

    expect(result.current.settings.primaryColor).toBe("#0000ff")
    expect(result.current.settings.fontSize).toBe("small")
    expect(result.current.hasChanges).toBe(false)
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.APP_SETTINGS, expect.objectContaining({
      primaryColor: "#0000ff",
      fontSize: "small",
    }))
  })

  it("should reset settings to defaults and clear storage", () => {
    const customSettings: AppSettings = {
      ...defaultSettings,
      primaryColor: "#ff00ff",
      spacing: "comfortable",
    }

    vi.mocked(storage.get).mockReturnValue(customSettings)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.settings).toEqual(defaultSettings)
    expect(result.current.pendingSettings).toEqual(defaultSettings)
    expect(result.current.hasChanges).toBe(false)
    expect(storage.remove).toHaveBeenCalledWith(STORAGE_KEYS.APP_SETTINGS)
  })

  it("should detect changes between settings and pendingSettings", () => {
    vi.mocked(storage.get).mockReturnValue(null)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    expect(result.current.hasChanges).toBe(false)

    act(() => {
      result.current.updatePendingSettings({ borderRadius: "large" })
    })

    expect(result.current.hasChanges).toBe(true)

    act(() => {
      result.current.applySettings()
    })

    expect(result.current.hasChanges).toBe(false)
  })

  it("should handle invalid saved settings gracefully", () => {
    vi.mocked(storage.get).mockReturnValue({ invalid: "data" })

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    waitFor(() => {
      // Should fall back to defaults for invalid properties
      expect(result.current.settings.fontFamily).toBe(defaultSettings.fontFamily)
      expect(result.current.settings.primaryColor).toBe(defaultSettings.primaryColor)
    })
  })

  it("should throw error when useSettings is called outside provider", () => {
    expect(() => {
      renderHook(() => useSettings())
    }).toThrow("useSettings must be used within a SettingsProvider")
  })

  it("should support partial settings updates", () => {
    vi.mocked(storage.get).mockReturnValue(null)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    act(() => {
      result.current.updatePendingSettings({ primaryColor: "#123456" })
    })

    expect(result.current.pendingSettings.primaryColor).toBe("#123456")
    // Other settings should remain unchanged
    expect(result.current.pendingSettings.fontSize).toBe(defaultSettings.fontSize)
    expect(result.current.pendingSettings.spacing).toBe(defaultSettings.spacing)
  })

  it("should handle multiple pending updates before applying", () => {
    vi.mocked(storage.get).mockReturnValue(null)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    act(() => {
      result.current.updatePendingSettings({ primaryColor: "#111111" })
      result.current.updatePendingSettings({ fontSize: "large" })
      result.current.updatePendingSettings({ spacing: "comfortable" })
    })

    expect(result.current.pendingSettings.primaryColor).toBe("#111111")
    expect(result.current.pendingSettings.fontSize).toBe("large")
    expect(result.current.pendingSettings.spacing).toBe("comfortable")
    expect(result.current.hasChanges).toBe(true)

    // Applied settings should still be defaults
    expect(result.current.settings).toEqual(defaultSettings)
  })
})

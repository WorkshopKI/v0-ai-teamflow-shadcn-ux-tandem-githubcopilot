"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { featureRegistry } from "./registry"
import type { Feature, FeatureContextType } from "./types"

const FeatureContext = createContext<FeatureContextType | undefined>(undefined)

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set())

  // Load enabled features from storage on mount
  useEffect(() => {
    const savedEnabled = storage.get(STORAGE_KEYS.ENABLED_FEATURES, null) as string[] | null
    
    if (savedEnabled === null) {
      // First run - initialize with features that have enabled: true
      const allFeatures = featureRegistry.getAll()
      const defaultEnabled = allFeatures.filter((f) => f.enabled).map((f) => f.id)
      setEnabledFeatures(new Set(defaultEnabled))
      storage.set(STORAGE_KEYS.ENABLED_FEATURES, defaultEnabled)
    } else {
      setEnabledFeatures(new Set(savedEnabled))
    }
  }, [])

  // Sync enabled state to registry when it changes
  useEffect(() => {
    const allFeatures = featureRegistry.getAll()
    allFeatures.forEach((feature) => {
      feature.enabled = enabledFeatures.has(feature.id)
    })
  }, [enabledFeatures])

  const enable = (featureId: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev)
      next.add(featureId)
      storage.set(STORAGE_KEYS.ENABLED_FEATURES, Array.from(next))
      return next
    })
  }

  const disable = (featureId: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev)
      next.delete(featureId)
      storage.set(STORAGE_KEYS.ENABLED_FEATURES, Array.from(next))
      return next
    })
  }

  const toggle = (featureId: string) => {
    if (enabledFeatures.has(featureId)) {
      disable(featureId)
    } else {
      enable(featureId)
    }
  }

  const isEnabled = (featureId: string): boolean => {
    return enabledFeatures.has(featureId)
  }

  const getFeature = (featureId: string): Feature | undefined => {
    return featureRegistry.get(featureId)
  }

  const allFeatures = featureRegistry.getAll()
  const enabled = allFeatures.filter((f) => enabledFeatures.has(f.id))

  return (
    <FeatureContext.Provider
      value={{
        features: allFeatures,
        enabledFeatures: enabled,
        isEnabled,
        enable,
        disable,
        toggle,
        getFeature,
      }}
    >
      {children}
    </FeatureContext.Provider>
  )
}

export function useFeatures() {
  const context = useContext(FeatureContext)
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureProvider")
  }
  return context
}

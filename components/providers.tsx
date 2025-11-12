"use client"

import { SettingsProvider } from "@/lib/settings"
import { FeatureProvider } from "@/lib/features"
import type { ReactNode } from "react"

// Import all features to register them
import "@/features"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <FeatureProvider>{children}</FeatureProvider>
    </SettingsProvider>
  )
}

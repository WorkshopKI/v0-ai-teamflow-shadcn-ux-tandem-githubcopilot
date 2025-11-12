import type { LucideIcon } from "lucide-react"
import type { ComponentType } from "react"

/**
 * Feature module definition
 * Each feature is a self-contained module that can be enabled/disabled
 */
export interface Feature {
  /** Unique identifier (matches route path) */
  id: string
  
  /** Display name */
  name: string
  
  /** Description for settings UI */
  description: string
  
  /** Icon component from lucide-react */
  icon: LucideIcon
  
  /** Whether feature is currently enabled */
  enabled: boolean
  
  /** Main page component */
  component: ComponentType
  
  /** Display order in navigation (lower numbers appear first) */
  order?: number
  
  /** Optional: Custom navigation items */
  navigationItems?: NavigationItem[]
  
  /** Optional: Settings panel component */
  settingsComponent?: ComponentType
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
}

/**
 * Feature registry configuration
 */
export interface FeatureRegistry {
  features: Map<string, Feature>
  enabledFeatures: Set<string>
}

/**
 * Feature context for React
 */
export interface FeatureContextType {
  features: Feature[]
  enabledFeatures: Feature[]
  isEnabled: (featureId: string) => boolean
  enable: (featureId: string) => void
  disable: (featureId: string) => void
  toggle: (featureId: string) => void
  getFeature: (featureId: string) => Feature | undefined
}

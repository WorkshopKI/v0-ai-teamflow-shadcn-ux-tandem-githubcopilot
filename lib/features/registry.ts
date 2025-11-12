import type { Feature } from "./types"
import { featureSchema } from "@/lib/schemas/feature"
import { z } from "zod"

/**
 * Feature Registry
 * Central registry for all feature modules with validation
 */
class FeatureRegistryManager {
  private features: Map<string, Feature> = new Map()

  /**
   * Register a feature module with schema validation
   */
  register(feature: Feature): void {
    // Validate feature against schema
    try {
      featureSchema.parse(feature)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          `[Features] Feature "${feature.id}" failed validation:`,
          error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
        )
        return
      }
      throw error
    }

    if (this.features.has(feature.id)) {
      console.warn(`[Features] Feature "${feature.id}" is already registered`)
      return
    }

    // Check for order collisions
    const existingWithSameOrder = this.getAll().find(
      (f) => (f.order ?? 999) === (feature.order ?? 999)
    )
    if (existingWithSameOrder) {
      console.warn(
        `[Features] Feature "${feature.id}" has same order (${feature.order}) as "${existingWithSameOrder.id}"`
      )
    }

    this.features.set(feature.id, feature)
  }

  /**
   * Unregister a feature module
   */
  unregister(featureId: string): void {
    this.features.delete(featureId)
  }

  /**
   * Get a feature by ID
   */
  get(featureId: string): Feature | undefined {
    return this.features.get(featureId)
  }

  /**
   * Get all registered features (sorted by order)
   */
  getAll(): Feature[] {
    return Array.from(this.features.values()).sort((a, b) => {
      const orderA = a.order ?? 999
      const orderB = b.order ?? 999
      return orderA - orderB
    })
  }

  /**
   * Get enabled features only
   */
  getEnabled(): Feature[] {
    return this.getAll().filter((f) => f.enabled)
  }

  /**
   * Check if a feature is registered
   */
  has(featureId: string): boolean {
    return this.features.has(featureId)
  }

  /**
   * Clear all features (useful for testing)
   */
  clear(): void {
    this.features.clear()
  }
}

// Singleton instance
export const featureRegistry = new FeatureRegistryManager()

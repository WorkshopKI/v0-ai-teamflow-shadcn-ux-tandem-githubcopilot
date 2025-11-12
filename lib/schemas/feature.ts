import { z } from "zod"

/**
 * Schema for validating feature registration metadata
 *
 * Ensures all features have required fields and correct types
 * to prevent runtime errors from malformed registrations.
 */
export const featureSchema = z.object({
  /** Unique feature identifier (kebab-case recommended) */
  id: z
    .string()
    .min(1, "Feature id is required")
    .regex(/^[a-z0-9-]+$/, "Feature id must be lowercase alphanumeric with hyphens"),

  /** Display name for navigation */
  name: z.string().min(1, "Feature name is required"),

  /** Short description for tooltips/docs */
  description: z.string().optional(),

  /** Lucide icon component */
  icon: z.any().refine((val) => typeof val === "function" || typeof val === "object", {
    message: "Icon must be a valid React component",
  }),

  /** Whether feature is enabled by default */
  enabled: z.boolean().default(true),

  /** Sort order in navigation (lower = earlier) */
  order: z.number().int().nonnegative().default(999),

  /** Page component to render */
  component: z.any().refine((val) => typeof val === "function" || typeof val === "object", {
    message: "Component must be a valid React component",
  }),
})

export type FeatureSchema = z.infer<typeof featureSchema>

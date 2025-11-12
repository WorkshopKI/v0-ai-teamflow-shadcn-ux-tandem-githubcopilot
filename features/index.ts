/**
 * Feature modules index
 * Import all features to register them with the system
 */

// Core features
import "./tasks"
import "./agents"
import "./workflows"
import "./templates"

// Example features (for learning/reference)
import "./_examples/minimal"

// Export feature registry for use in app
export { featureRegistry, useFeatures } from "@/lib/features"

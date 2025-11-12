import { FileText } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import MinimalExamplePage from "./page"

/**
 * Minimal Example Feature Registration
 *
 * This is a reference implementation showing the simplest possible feature.
 * Disable this feature in Settings → Features once you understand the pattern.
 */
featureRegistry.register({
  id: "minimal-example",
  name: "Minimal Example",
  description: "Reference implementation of feature patterns",
  icon: FileText,
  enabled: false, // Disabled by default (enable in Settings to explore)
  order: 999, // Last in navigation
  component: MinimalExamplePage,
})

export { default } from "./page"

import { Layers } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import TemplatesPage from "./page"

featureRegistry.register({
  id: "templates",
  name: "Templates",
  description: "Pre-built team templates and workflows",
  icon: Layers,
  enabled: true,
  order: 4,
  component: TemplatesPage,
})

export { default } from "./page"

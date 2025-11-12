import { Workflow } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import WorkflowsPage from "./page"

featureRegistry.register({
  id: "workflows",
  name: "Workflows",
  description: "Visual workflow automation builder",
  icon: Workflow,
  enabled: true,
  order: 2,
  component: WorkflowsPage,
})

export { default } from "./page"

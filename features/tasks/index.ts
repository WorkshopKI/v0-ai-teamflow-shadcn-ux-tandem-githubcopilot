import { CheckSquare } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import TasksPage from "./page"

// Register the tasks feature
featureRegistry.register({
  id: "tasks",
  name: "Tasks",
  description: "Organize and track team tasks with kanban boards and list views",
  icon: CheckSquare,
  enabled: true, // Enabled by default
  order: 1,
  component: TasksPage,
})

// Re-export for dynamic imports
export { default } from "./page"

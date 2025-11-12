import { Bot } from "lucide-react"
import { featureRegistry } from "@/lib/features"
import AgentsPage from "./page"

featureRegistry.register({
  id: "agents",
  name: "AI Agents",
  description: "Configure and manage AI team members",
  icon: Bot,
  enabled: true,
  order: 3,
  component: AgentsPage,
})

export { default } from "./page"

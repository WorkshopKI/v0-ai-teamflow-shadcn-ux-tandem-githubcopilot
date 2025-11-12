import { Zap, Mail, Database, MessageSquare, Clock } from "lucide-react"
import type { Workflow } from "@/lib/types"

/**
 * Mock workflows for development and testing
 */
export const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Customer Onboarding",
    description: "Automated workflow for new customer setup",
    nodes: [
      { id: "n1", type: "trigger", label: "Webhook Trigger", icon: Zap, config: {}, position: { x: 50, y: 50 } },
      { id: "n2", type: "action", label: "Send Email", icon: Mail, config: {}, position: { x: 50, y: 150 } },
      { id: "n3", type: "action", label: "Database Query", icon: Database, config: {}, position: { x: 50, y: 250 } },
    ],
    status: "active",
    lastRun: "2025-02-02T10:30:00",
    runs: 1247,
  },
  {
    id: "2",
    name: "Daily Report Generator",
    description: "Generate and send daily analytics reports",
    nodes: [
      { id: "n1", type: "trigger", label: "Schedule Trigger", icon: Clock, config: {}, position: { x: 50, y: 50 } },
      { id: "n2", type: "action", label: "Database Query", icon: Database, config: {}, position: { x: 50, y: 150 } },
      {
        id: "n3",
        type: "action",
        label: "AI Agent",
        icon: MessageSquare,
        config: {},
        position: { x: 50, y: 250 },
      },
      { id: "n4", type: "action", label: "Send Email", icon: Mail, config: {}, position: { x: 50, y: 350 } },
    ],
    status: "active",
    lastRun: "2025-02-02T08:00:00",
    runs: 45,
  },
]

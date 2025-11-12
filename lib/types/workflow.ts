/**
 * Workflow type definitions
 */

import type { ComponentType } from "react"

export type NodeType = "trigger" | "action" | "condition" | "delay"

export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  icon: ComponentType<{ className?: string }>
  config: Record<string, unknown>
  position: { x: number; y: number }
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  status: "active" | "draft" | "paused"
  lastRun?: string
  runs: number
}

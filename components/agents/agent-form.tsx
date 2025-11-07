"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { agentSchema, type AgentFormData } from "@/lib/schemas/agent"
import { agentTypeConfig } from "@/lib/config/agent"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { Agent, AgentType } from "@/lib/types/agent"

interface AgentFormProps {
  onCreate(agent: Agent): void
  availableModels: { value: string; label: string }[]
  availableTools: string[]
  defaultValues?: Partial<AgentFormData>
}

export function AgentForm({ onCreate, availableModels, availableTools, defaultValues }: AgentFormProps) {
  const [toolSelection, setToolSelection] = useState<string[]>([])
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "conversational",
      model: availableModels[0]?.value || "gpt-4-turbo",
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: "",
      tools: [],
      ...defaultValues,
    },
  })

  const submit = (data: AgentFormData) => {
    const agent: Agent = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      type: data.type as AgentType,
      status: "paused",
      model: data.model,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      systemPrompt: data.systemPrompt,
      tools: toolSelection,
      interactions: 0,
      successRate: 0,
      avgResponseTime: 0,
      createdAt: new Date().toISOString(),
    }
    onCreate(agent)
    form.reset()
    setToolSelection([])
  }

  const toggleTool = (tool: string) => {
    setToolSelection((curr) => (curr.includes(tool) ? curr.filter((t) => t !== tool) : [...curr, tool]))
  }

  return (
    <form
      className="space-y-4 py-2"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(submit)()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="agent-name">Agent Name</Label>
        <Input id="agent-name" placeholder="e.g., Customer Support Bot" {...form.register("name")} />
        {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="agent-description">Description</Label>
        <Textarea id="agent-description" rows={2} placeholder="Describe what this agent does" {...form.register("description")} />
      </div>
      <div className="space-y-2">
        <Label>Agent Type</Label>
        <Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v as AgentType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
            <SelectContent>
            {Object.entries(agentTypeConfig).map(([value, cfg]) => (
              <SelectItem key={value} value={value}>{cfg.label} - {cfg.description}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>AI Model</Label>
        <Select value={form.watch("model")} onValueChange={(v) => form.setValue("model", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Temperature: {form.watch("temperature")}</Label>
        <Slider value={[form.watch("temperature")]} onValueChange={([v]) => form.setValue("temperature", v ?? 0.7)} min={0} max={1} step={0.1} />
        <p className="text-xs text-muted-foreground">Lower = more focused, Higher = more creative</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-tokens">Max Tokens</Label>
        <Input id="max-tokens" type="number" {...form.register("maxTokens", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="system-prompt">System Prompt</Label>
        <Textarea id="system-prompt" rows={4} placeholder="Define the agent's behavior and personality" {...form.register("systemPrompt")} />
      </div>
      <div className="space-y-2">
        <Label>Tools & Capabilities</Label>
        <div className="grid grid-cols-2 gap-2">
          {availableTools.map((tool) => (
            <div key={tool} className="flex items-center space-x-2">
              <Switch checked={toolSelection.includes(tool)} onCheckedChange={() => toggleTool(tool)} />
              <Label className="text-sm cursor-pointer" onClick={() => toggleTool(tool)}>{tool.replace("_", " ")}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={!form.watch("name") || !form.watch("systemPrompt")}>Create Agent</Button>
      </div>
    </form>
  )
}

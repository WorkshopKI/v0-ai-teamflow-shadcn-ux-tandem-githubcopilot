import type { Meta, StoryObj } from '@storybook/react'
import { StatsCard } from './stats-card'
import { Bot, Activity, TrendingUp } from 'lucide-react'

const meta: Meta<typeof StatsCard> = {
  title: 'Components/StatsCard',
  component: StatsCard,
  args: {
    title: 'AI Agents',
    value: 5,
    icon: Bot,
    subtext: 'active now',
  },
}

export default meta

type Story = StoryObj<typeof StatsCard>

export const Default: Story = {}

export const WithHighlight: Story = {
  args: {
    title: 'Interactions',
    value: '10,234',
    icon: Activity,
    highlight: '+12%',
    subtext: 'vs last week',
  },
}

export const SuccessRate: Story = {
  args: {
    title: 'Avg Success Rate',
    value: '94.5%',
    icon: TrendingUp,
    subtext: 'mean across agents',
  },
}

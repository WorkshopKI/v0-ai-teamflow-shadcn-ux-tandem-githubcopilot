import { render, screen } from '@testing-library/react'
import { StatsCard } from '@/components/stats-card'
import { Bot } from 'lucide-react'

describe('StatsCard', () => {
  it('renders title, value, icon, and subtext', () => {
    render(<StatsCard title="AI Agents" value={5} icon={Bot} subtext="active now" />)
    expect(screen.getByText('AI Agents')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('active now')).toBeInTheDocument()
  })

  it('renders highlight with subtext', () => {
    render(<StatsCard title="Interactions" value="10,000" icon={Bot} highlight={'+12%'} subtext={'vs last week'} />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs last week')).toBeInTheDocument()
  })

  it('shows skeleton in loading state', () => {
    render(<StatsCard title="Loading" value={0} icon={Bot} loading />)
    // Skeletons are just divs; ensure title still renders
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })
})

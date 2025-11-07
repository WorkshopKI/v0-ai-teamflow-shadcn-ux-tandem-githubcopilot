import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { AgentForm } from '@/components/agents/agent-form'

const models = [
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' }
]
const tools = ['web_search', 'email_sending']

describe('AgentForm', () => {
  it('submits valid data and calls onCreate', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<AgentForm onCreate={onCreate} availableModels={models} availableTools={tools} />)

    await user.type(screen.getByLabelText(/Agent Name/i), 'Support Bot')
    await user.type(screen.getByLabelText(/Description/i), 'Handles support')
    await user.type(screen.getByLabelText(/System Prompt/i), 'Be helpful')

    // Toggle a tool
    const toolLabel = screen.getByText('web search')
    await user.click(toolLabel)

    const submitButton = screen.getByRole('button', { name: /Create Agent/i })
    expect(submitButton).not.toBeDisabled()
    await user.click(submitButton)

    expect(onCreate).toHaveBeenCalledTimes(1)
    const created = onCreate.mock.calls[0][0]
    expect(created.name).toBe('Support Bot')
    expect(created.tools).toContain('web_search')
  })

  it('blocks submission when required fields missing', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<AgentForm onCreate={onCreate} availableModels={models} availableTools={tools} />)

    const submitButton = screen.getByRole('button', { name: /Create Agent/i })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText(/Agent Name/i), 'X')
    await user.click(submitButton)

    expect(onCreate).not.toHaveBeenCalled()
  })
})

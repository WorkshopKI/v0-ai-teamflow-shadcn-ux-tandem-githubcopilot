import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SettingsProvider } from '@/lib/settings'

// Mock storage
const mockStorage = new Map<string, string>()
vi.mock('@/lib/storage', () => ({
  storage: {
    get: vi.fn((key: string, defaultValue: unknown) => {
      const value = mockStorage.get(key)
      return value ? JSON.parse(value) : defaultValue
    }),
    set: vi.fn((key: string, value: unknown) => {
      mockStorage.set(key, JSON.stringify(value))
    }),
    remove: vi.fn((key: string) => {
      mockStorage.delete(key)
    }),
  },
  STORAGE_KEYS: {
    APP_SETTINGS: 'appSettings',
  },
}))

function TestComponent() {
  return <div>Test Content</div>
}

describe('Font Settings', () => {
  beforeEach(() => {
    mockStorage.clear()
  })

  it('applies default font family and size', async () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-family')).toBe('var(--font-sans)')
      expect(root.style.getPropertyValue('--base-font-size')).toBe('16px')
      expect(root.style.getPropertyValue('--active-font-weight')).toBe('400')
    })
  })

  it('applies serif font family from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'serif',
        fontSize: 'medium',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-family')).toBe('var(--font-serif)')
    })
  })

  it('applies mono font family from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'mono',
        fontSize: 'medium',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-family')).toBe('var(--font-mono)')
    })
  })

  it('applies small font size from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'sans',
        fontSize: 'small',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--base-font-size')).toBe('14px')
    })
  })

  it('applies large font size from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'sans',
        fontSize: 'large',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--base-font-size')).toBe('18px')
    })
  })

  it('applies bold font face from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'sans',
        fontSize: 'medium',
        fontFace: 'bold',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-weight')).toBe('700')
    })
  })

  it('applies both font family and size together', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'mono',
        fontSize: 'large',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-family')).toBe('var(--font-mono)')
      expect(root.style.getPropertyValue('--base-font-size')).toBe('18px')
    })
  })

  it('applies system font family from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'system',
        fontSize: 'medium',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-family')).toContain('-apple-system')
    })
  })

  it('applies roboto font family from settings', async () => {
    mockStorage.set(
      'appSettings',
      JSON.stringify({
        fontFamily: 'roboto',
        fontSize: 'medium',
        fontFace: 'regular',
        primaryColor: '#0a3874',
        accentColor: '#306bb3',
        sidebarPosition: 'left',
        spacing: 'compact',
        borderRadius: 'medium',
        theme: 'system',
      })
    )

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    )

    await waitFor(() => {
      const root = document.documentElement
      expect(root.style.getPropertyValue('--active-font-family')).toBe('var(--font-roboto)')
    })
  })
})

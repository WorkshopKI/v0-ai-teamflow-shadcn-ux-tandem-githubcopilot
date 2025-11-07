import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Deterministic date formatting for SSR/CSR parity
export function formatDateISO(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  // Use ISO date (YYYY-MM-DD) to avoid locale-dependent hydration mismatches
  return d.toISOString().slice(0, 10)
}

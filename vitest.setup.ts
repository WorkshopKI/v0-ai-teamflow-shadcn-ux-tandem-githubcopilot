import '@testing-library/jest-dom'
import { expect, vi } from 'vitest'
// Re-export vitest globals for TS awareness in test files without importing each time
declare global {
	// eslint-disable-next-line no-var
	var vi: typeof vi
}
globalThis.vi = vi

// Minimal DOM observers polyfills for jsdom-based tests
// Radix UI relies on ResizeObserver which isn't provided by jsdom
if (typeof (globalThis as any).ResizeObserver === 'undefined') {
	class ResizeObserver {
		callback: ResizeObserverCallback
		constructor(callback: ResizeObserverCallback) {
			this.callback = callback
		}
		observe(): void {}
		unobserve(): void {}
		disconnect(): void {}
	}
	;(globalThis as any).ResizeObserver = ResizeObserver
}

// Some components may indirectly expect IntersectionObserver
if (typeof (globalThis as any).IntersectionObserver === 'undefined') {
	class IntersectionObserver {
		constructor(_: IntersectionObserverCallback) {}
		observe(): void {}
		unobserve(): void {}
		disconnect(): void {}
		takeRecords(): IntersectionObserverEntry[] { return [] }
		root: Element | Document | null = null
		rootMargin = ''
		thresholds: ReadonlyArray<number> = []
	}
	;(globalThis as any).IntersectionObserver = IntersectionObserver
}

"use client"

export type DataSourceState = 'static' | 'cached' | 'live'

type CacheEnvelope<T> = {
  savedAt: number
  value: T
}

export function readCachedValue<T>(key: string, maxAgeMs: number): CacheEnvelope<T> | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw) as CacheEnvelope<T>
    if (!parsed || typeof parsed.savedAt !== 'number') return null
    if (Date.now() - parsed.savedAt > maxAgeMs) return null

    return parsed
  } catch {
    return null
  }
}

export function writeCachedValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return

  try {
    const payload: CacheEnvelope<T> = {
      savedAt: Date.now(),
      value,
    }
    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Ignore storage quota / privacy mode failures and keep the UI functional.
  }
}

export async function fetchJsonWithTimeout<T>(
  input: string,
  init: RequestInit = {},
  timeoutMs = 5000
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(input, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return (await response.json()) as T
  } finally {
    window.clearTimeout(timeoutId)
  }
}

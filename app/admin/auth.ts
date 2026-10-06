import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecretKey(): string {
  return process.env.ADMIN_PASSWORD || 'victoria2026!'
}

// Generate HMAC-SHA256 signature using native Web Crypto API
async function sign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyAndCreateSession(passwordAttempt: string): Promise<boolean> {
  const correctPassword = getSecretKey()
  if (passwordAttempt !== correctPassword) {
    return false
  }

  const timestamp = Date.now().toString()
  const signature = await sign(timestamp, correctPassword)
  const sessionToken = `${timestamp}.${signature}`

  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return true
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value
  if (!sessionCookie) return false

  const parts = sessionCookie.split('.')
  if (parts.length !== 2) return false

  const [timestampStr, signature] = parts
  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) return false

  // Check if expired (7 days)
  if (Date.now() - timestamp > SESSION_MAX_AGE * 1000) {
    return false
  }

  const expectedSig = await sign(timestampStr, getSecretKey())
  return signature === expectedSig
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

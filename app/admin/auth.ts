import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecretKey(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error('ADMIN_PASSWORD environment variable is not configured on the server.')
  }
  return secret
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
    return null
  }
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

// Generate HMAC-SHA256 signature using native Web Crypto API
async function sign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await importHmacKey(secret)
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Constant-time HMAC verification using Web Crypto API
async function verifySignature(message: string, hexSignature: string, secret: string): Promise<boolean> {
  const sigBytes = hexToBytes(hexSignature)
  if (!sigBytes) return false
  const enc = new TextEncoder()
  const key = await importHmacKey(secret)
  return crypto.subtle.verify('HMAC', key, sigBytes as unknown as BufferSource, enc.encode(message))
}

// Constant-time string comparison via HMAC
async function constantTimeEqual(a: string, b: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder()
  const key = await importHmacKey(secret)
  const sigA = await crypto.subtle.sign('HMAC', key, enc.encode(a))
  return crypto.subtle.verify('HMAC', key, sigA, enc.encode(b))
}

export async function verifyAndCreateSession(passwordAttempt: string): Promise<boolean> {
  const correctPassword = getSecretKey()
  const isMatch = await constantTimeEqual(passwordAttempt, correctPassword, correctPassword)
  if (!isMatch) {
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
  try {
    const secret = getSecretKey()
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

    return await verifySignature(timestampStr, signature, secret)
  } catch {
    return false
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

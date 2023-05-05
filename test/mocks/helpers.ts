import { CompactEncrypt, importJWK, importSPKI } from 'jose'
import jwt from 'jsonwebtoken'

import {
  MOCK_BLOCK_KEY,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PUBLIC_KEY,
  MOCK_HOSTNAME,
  MOCK_PRIVATE_KEY,
  MOCK_SUB,
  MOCK_USERINFO_PLAINTEXT,
} from './constants'

export const generateUserInfo = async (): Promise<Record<string, string>> => {
  const result: Record<string, string> = {}
  const keyObj = await importJWK(MOCK_BLOCK_KEY)
  for (const [key, value] of Object.entries(MOCK_USERINFO_PLAINTEXT)) {
    const jwe = await new CompactEncrypt(new TextEncoder().encode(value))
      .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
      .encrypt(keyObj)
    result[key] = jwe
  }
  return result
}

export const generateEncryptedBlockKey = async (): Promise<string> => {
  const keyObj = await importSPKI(MOCK_CLIENT_PUBLIC_KEY, 'RSA-OAEP-256')
  return new CompactEncrypt(
    new TextEncoder().encode(JSON.stringify(MOCK_BLOCK_KEY)),
  )
    .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
    .encrypt(keyObj)
}

export const generateIdToken = (sub = MOCK_SUB): string => {
  const secondsSinceEpoch = Math.floor(Date.now() / 1000)
  const idTokenContent = {
    iss: MOCK_HOSTNAME,
    sub,
    aud: MOCK_CLIENT_ID,
    exp: secondsSinceEpoch + 300,
    iat: secondsSinceEpoch,
  }
  return jwt.sign(idTokenContent, MOCK_PRIVATE_KEY, { algorithm: 'RS256' })
}

/**
 * Regex pattern that the code verifier and code challenge in the PKCE flow should match according to the PKCE RFC
 * https://www.rfc-editor.org/rfc/rfc7636
 */
export const codeVerifierAndChallengePattern = /^[A-Za-z\d\-._~]{43,128}$/

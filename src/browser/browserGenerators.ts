import * as Errors from '../error'

/**
 * Generates a PKCE challenge pair where `codeChallenge` is the generated S256 challenge from `codeVerifier`
 * @param length The length of the code verifier
 * @returns The generated challenge pair
 */
export async function generatePkcePairBrowser(length = 43): Promise<{
  codeVerifier: string
  codeChallenge: string
}> {
  if (length < 43 || length > 128) {
    throw new Error(Errors.PKCE_PAIR_LENGTH_ERROR)
  }

  const codeVerifier = generateCodeVerifierBrowser(length)
  const codeChallenge = await generateCodeChallengeBrowser(codeVerifier)

  return { codeVerifier, codeChallenge }
}

/**
 * Generates the code verifier (random bytes encoded in url safe base 64) to be used in the OAuth 2.0 PKCE flow
 * @param length The length of the code verifier to generate (Defaults to 43 if not provided)
 * @returns The generated code verifier
 */
export function generateCodeVerifierBrowser(length = 43): string {
  if (length < 43 || length > 128) {
    throw new Error(Errors.CODE_VERIFIER_LENGTH_ERROR)
  }

  // 96 bytes results in a 128 long base64 string
  // This works because a prefix of a random string is still random
  const randomArr = new Uint8Array(96)
  const bufferArr = window.crypto.getRandomValues(randomArr)

  return encodeBase64Url(bufferArr)
}

/**
 * Calculates the S256 PKCE code challenge for a provided code verifier
 * @param codeVerifier The code verifier to calculate the S256 code challenge for
 * @returns The calculated code challenge
 */
export async function generateCodeChallengeBrowser(
  codeVerifier: string,
): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier),
  )
  const bufferArr = new Uint8Array(buffer)
  // Generate base64url string
  // btoa is deprecated in Node.js but is used here for web browser compatibility
  // (which has no good replacement yet, see also https://github.com/whatwg/html/issues/6811)

  return encodeBase64Url(bufferArr)
}

function encodeBase64Url(bufferArr: Uint8Array): string {
  return btoa(
    Array.from(new Uint8Array(bufferArr))
      .map((val) => {
        return String.fromCharCode(val)
      })
      .join(''),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

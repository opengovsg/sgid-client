import { generators } from 'openid-client'

/**
 * Generates a PKCE challenge pair where `codeChallenge` is the generated S256 challenge from `codeVerifier`
 * @param length The length of the code verifier
 * @returns The generated challenge pair
 */
export function generatePkcePair(length = 43): {
  codeVerifier: string
  codeChallenge: string
} {
  const codeVerifier = generateCodeVerifier(length)
  const codeChallenge = generateCodeChallenge(codeVerifier)

  return { codeVerifier, codeChallenge }
}

/**
 * Generates the code verifier (random bytes encoded in url safe base 64) to be used in the OAuth 2.0 PKCE flow
 * @param length The length of the code verifier to generate (Defaults to 43 if not provided)
 * @returns The generated code verifier
 */
export function generateCodeVerifier(length = 43): string {
  if (length < 43 || length > 128) {
    // eslint-disable-next-line typesafe/no-throw-sync-func
    throw new Error(
      `The code verifier should have a minimum length of 43 and a maximum length of 128. Length of ${length} was provided`,
    )
  }

  // 96 bytes results in a 128 long base64 string
  const codeVerifier = generators.codeVerifier(96)

  // This works because a prefix of a random string is still random
  return codeVerifier.slice(0, length)
}

/**
 * Calculates the S256 PKCE code challenge for a provided code verifier
 * @param codeVerifier The code verifier to calculate the S256 code challenge for
 * @returns The calculated code challenge
 */
export function generateCodeChallenge(codeVerifier: string): string {
  return generators.codeChallenge(codeVerifier)
}

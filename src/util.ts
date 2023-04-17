import NodeRSA from 'node-rsa'

/**
 * Convert PKCS1 PEM private key to PKCS8 PEM
 */
export function convertPkcs1ToPkcs8(pkcs1: string): string {
  const key = new NodeRSA(pkcs1, 'pkcs1')
  return key.exportKey('pkcs8')
}

/**
 * Regex pattern that the code verifier and code challenge in the PKCE flow should match according to the PKCE RFC
 * https://www.rfc-editor.org/rfc/rfc7636
 */
export const codeVerifierAndChallengePattern = /^[A-Za-z\d\-._~]{43,128}$/

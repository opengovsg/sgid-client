import { readFileSync } from 'fs'

import mockClientKeys from './mockClientKeys.json'

// Metadata about mock server
// Private key which pairs with public key from ./mockPublicJwks.json
export const MOCK_PRIVATE_KEY = readFileSync(
  `${__dirname}/mockPrivateKey.pem`,
).toString()
export const MOCK_HOSTNAME = 'https://id.sgid.com'
export const MOCK_API_VERSION = 2
export const MOCK_AUTH_ENDPOINT = `${MOCK_HOSTNAME}/v${MOCK_API_VERSION}/oauth/authorize`
export const MOCK_TOKEN_ENDPOINT = `${MOCK_HOSTNAME}/v${MOCK_API_VERSION}/oauth/token`
export const MOCK_USERINFO_ENDPOINT = `${MOCK_HOSTNAME}/v${MOCK_API_VERSION}/oauth/userinfo`
export const MOCK_JWKS_ENDPOINT = `${
  new URL(MOCK_HOSTNAME).origin
}/.well-known/jwks.json`

// RP configuration
export const MOCK_CLIENT_ID = 'mockClientId'
export const MOCK_CLIENT_SECRET = 'mockClientSecret'
export const MOCK_REDIRECT_URI = 'https://sgid.com/callback'
export const MOCK_CLIENT_PUBLIC_KEY = mockClientKeys.publicKey
export const MOCK_CLIENT_PRIVATE_KEY = mockClientKeys.privateKey

// Data returned by mock server
export const MOCK_BLOCK_KEY = {
  kty: 'oct',
  alg: 'A128GCM',
  k: 'kMnXcwOisOQskMlIu5oqVA',
}
export const MOCK_SUB = 'mockSub'
export const MOCK_AUTH_CODE = 'mockAuthCode'
export const MOCK_ACCESS_TOKEN = 'mockAccessToken'
export const MOCK_USERINFO_PLAINTEXT = {
  myKey: 'myValue',
}
export const MOCK_CODE_VERIFIER = 'bbGcObXZC1YGBQZZtZGQH9jsyO1vypqCGqnSU_4TI5S'
export const MOCK_CODE_CHALLENGE = 'zaqUHoBV3rnhBF2g0Gkz1qkpEZXHqi2OrPK1DqRi-Lk'

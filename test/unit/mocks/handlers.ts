import { rest } from 'msw'

import {
  MOCK_ACCESS_TOKEN,
  MOCK_AUTH_CODE,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_CODE_VERIFIER,
  MOCK_JWKS_ENDPOINT,
  MOCK_REDIRECT_URI,
  MOCK_SUB,
  MOCK_TOKEN_ENDPOINT,
  MOCK_USERINFO_ENDPOINT,
} from './constants'
import {
  generateEncryptedBlockKey,
  generateIdToken,
  generateUserInfo,
} from './helpers'
import mockPublicJwks from './mockPublicJwks.json'

/**
 * Mocks well-known JWKS endpoint
 */
const jwksHandler = rest.get(MOCK_JWKS_ENDPOINT, (_req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockPublicJwks))
})

/**
 * Happy path token handler (with PKCE)
 */
const tokenHandler = rest.post(MOCK_TOKEN_ENDPOINT, async (req, res, ctx) => {
  // Request is application/x-www-form-urlencoded
  const bodyString = await req.text()
  const body = new URLSearchParams(bodyString)
  if (
    body.get('grant_type') !== 'authorization_code' ||
    body.get('code') !== MOCK_AUTH_CODE ||
    body.get('redirect_uri') !== MOCK_REDIRECT_URI ||
    body.get('client_id') !== MOCK_CLIENT_ID ||
    body.get('client_secret') !== MOCK_CLIENT_SECRET ||
    body.get('code_verifier') !== MOCK_CODE_VERIFIER
  ) {
    return res(ctx.status(400))
  }
  return res(
    ctx.status(200),
    ctx.json({
      access_token: MOCK_ACCESS_TOKEN,
      id_token: generateIdToken(),
    }),
  )
})

/**
 * Handler to test case where server doesn't return access token
 */
export const tokenHandlerNoToken = rest.post(
  MOCK_TOKEN_ENDPOINT,
  (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id_token: generateIdToken(),
      }),
    )
  },
)

/**
 * Handler to test case where server doesn't return an id token
 */
export const tokenHandlerNoIdToken = rest.post(
  MOCK_TOKEN_ENDPOINT,
  (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: MOCK_ACCESS_TOKEN,
      }),
    )
  },
)

/**
 * Handler to test case where sub is empty
 */
export const tokenHandlerNoSub = rest.post(
  MOCK_TOKEN_ENDPOINT,
  (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: MOCK_ACCESS_TOKEN,
        id_token: generateIdToken(''),
      }),
    )
  },
)

/**
 * Happy path userinfo handler
 */
const userInfoHandler = rest.get(
  MOCK_USERINFO_ENDPOINT,
  async (req, res, ctx) => {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${MOCK_ACCESS_TOKEN}`) {
      return res(ctx.status(401))
    }
    const encKey = await generateEncryptedBlockKey()
    const data = await generateUserInfo()
    return res(
      ctx.status(200),
      ctx.json({
        sub: MOCK_SUB,
        key: encKey,
        data,
      }),
    )
  },
)

/**
 * Handler to test case where userinfo endpoint returns a sub
 * which is different from the sub previously returned in the
 * ID token from the callback endpoint
 */
export const userInfoHandlerMismatchedSub = rest.get(
  MOCK_USERINFO_ENDPOINT,
  async (_req, res, ctx) => {
    const data = await generateUserInfo()
    return res(
      ctx.status(200),
      ctx.json({
        sub: 'mismatchedSub',
        data,
      }),
    )
  },
)

/**
 * Handler to test case where userinfo endpoint does not return key
 */
export const userInfoHandlerNoKey = rest.get(
  MOCK_USERINFO_ENDPOINT,
  async (_req, res, ctx) => {
    const data = await generateUserInfo()
    return res(
      ctx.status(200),
      ctx.json({
        sub: MOCK_SUB,
        data,
      }),
    )
  },
)

/**
 * Handler to test case where userinfo endpoint does not return data
 */
export const userInfoHandlerNoData = rest.get(
  MOCK_USERINFO_ENDPOINT,
  async (_req, res, ctx) => {
    const encKey = await generateEncryptedBlockKey()
    return res(
      ctx.status(200),
      ctx.json({
        sub: MOCK_SUB,
        key: encKey,
      }),
    )
  },
)

/**
 * Handler to test case where userinfo endpoint returns malformed key
 */
export const userInfoHandlerMalformedKey = rest.get(
  MOCK_USERINFO_ENDPOINT,
  async (_req, res, ctx) => {
    const data = await generateUserInfo()
    return res(
      ctx.status(200),
      ctx.json({
        sub: MOCK_SUB,
        key: 'malformed',
        data,
      }),
    )
  },
)

/**
 * Handler to test case where userinfo endpoint returns malformed data
 */
export const userInfoHandlerMalformedData = rest.get(
  MOCK_USERINFO_ENDPOINT,
  async (_req, res, ctx) => {
    const encKey = await generateEncryptedBlockKey()
    return res(
      ctx.status(200),
      ctx.json({
        sub: MOCK_SUB,
        key: encKey,
        data: { myKey: 'malformed' },
      }),
    )
  },
)

// Export happy path handlers as default
export const handlers = [tokenHandler, jwksHandler, userInfoHandler]

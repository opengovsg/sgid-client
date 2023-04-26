import { SgidClient } from '../src'

import {
  MOCK_ACCESS_TOKEN,
  MOCK_AUTH_CODE,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
  MOCK_CODE_VERIFIER,
  MOCK_HOSTNAME,
  MOCK_REDIRECT_URI,
  MOCK_SUB,
} from './mocks/constants'
import { tokenHandlerNoSubV2, tokenHandlerNoTokenV2 } from './mocks/handlers'
import { server } from './mocks/server'

describe('SgidClient: callback (with PKCE)', () => {
  let client: SgidClient

  beforeAll(() => {
    client = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: MOCK_CLIENT_PRIVATE_KEY,
      redirectUris: [MOCK_REDIRECT_URI],
      hostname: MOCK_HOSTNAME,
    })
  })

  it('should call token endpoint and return sub and accessToken', async () => {
    const { sub, accessToken } = await client.callback({
      code: MOCK_AUTH_CODE,
      codeVerifier: MOCK_CODE_VERIFIER,
    })

    expect(sub).toBe(MOCK_SUB)
    expect(accessToken).toBe(MOCK_ACCESS_TOKEN)
  })

  it('should throw when no code verifier is provided', async () => {
    await expect(client.callback({ code: MOCK_AUTH_CODE })).rejects.toThrow(
      "Code verifier must be provided in 'callback' when using apiVersion 2",
    )
  })

  it('should throw when no access token is returned', async () => {
    server.use(tokenHandlerNoTokenV2)

    await expect(
      client.callback({
        code: MOCK_AUTH_CODE,
        codeVerifier: MOCK_CODE_VERIFIER,
      }),
    ).rejects.toThrow('Missing sub claim or access token')
  })

  it('should throw when sub is empty', async () => {
    server.use(tokenHandlerNoSubV2)

    await expect(
      client.callback({
        code: MOCK_AUTH_CODE,
        codeVerifier: MOCK_CODE_VERIFIER,
      }),
    ).rejects.toThrow('Missing sub claim or access token')
  })
})

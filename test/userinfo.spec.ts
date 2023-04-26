import { SgidClient } from '../src'

import {
  MOCK_ACCESS_TOKEN,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
  MOCK_HOSTNAME,
  MOCK_REDIRECT_URI,
  MOCK_SUB,
  MOCK_USERINFO_PLAINTEXT,
} from './mocks/constants'
import {
  userInfoHandlerMalformedDataV2,
  userInfoHandlerMalformedKeyV2,
  userInfoHandlerNoDataV2,
  userInfoHandlerNoKeyV2,
} from './mocks/handlers'
import { server } from './mocks/server'

describe('SgidClient: userinfo', () => {
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

  it('should call userinfo endpoint and return sub and data', async () => {
    const { sub, data } = await client.userinfo(MOCK_ACCESS_TOKEN)

    expect(sub).toBe(MOCK_SUB)
    expect(data).toEqual(MOCK_USERINFO_PLAINTEXT)
  })

  it('should return empty data object when no key is returned', async () => {
    server.use(userInfoHandlerNoKeyV2)

    const { sub, data } = await client.userinfo(MOCK_ACCESS_TOKEN)

    expect(sub).toBe(MOCK_SUB)
    expect(data).toEqual({})
  })

  it('should return empty data object when no data is returned', async () => {
    server.use(userInfoHandlerNoDataV2)

    const { sub, data } = await client.userinfo(MOCK_ACCESS_TOKEN)

    expect(sub).toBe(MOCK_SUB)
    expect(data).toEqual({})
  })

  it('should throw when private key is invalid', async () => {
    const invalidPrivateKeyClient = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: 'malformed',
      redirectUris: [MOCK_REDIRECT_URI],
      hostname: MOCK_HOSTNAME,
    })

    await expect(
      invalidPrivateKeyClient.userinfo(MOCK_ACCESS_TOKEN),
    ).rejects.toThrow('Failed to import private key')
  })

  it('should throw when encrypted key is malformed', async () => {
    server.use(userInfoHandlerMalformedKeyV2)

    await expect(client.userinfo(MOCK_ACCESS_TOKEN)).rejects.toThrow(
      'Unable to decrypt or import payload key',
    )
  })

  it('should throw when encrypted data is malformed', async () => {
    server.use(userInfoHandlerMalformedDataV2)

    await expect(client.userinfo(MOCK_ACCESS_TOKEN)).rejects.toThrow(
      'Unable to decrypt payload',
    )
  })
})

import { readFileSync } from 'fs'

import { SgidClient } from '../src'

import {
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
  MOCK_HOSTNAME,
  MOCK_REDIRECT_URI,
} from './mocks/constants'

describe('SgidClient: constructor', () => {
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

  it('should initialise correctly when a PKCS1 private key is provided', () => {
    expect(client).toBeDefined()
  })

  it('should initialise correctly when a PKCS8 private key is provided', () => {
    const pkcs8Key = readFileSync(
      `${__dirname}/mocks/mockPrivateKeyPkcs8.pem`,
    ).toString()

    const pkcs8Client = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: pkcs8Key,
      redirectUris: [MOCK_REDIRECT_URI],
      hostname: MOCK_HOSTNAME,
    })

    expect(pkcs8Client).toBeDefined()
  })
})

import { readFileSync } from 'fs'

import SgidClient from '../src'
import { codeVerifierAndChallengePattern } from '../src/util'

import {
  MOCK_ACCESS_TOKEN,
  MOCK_API_VERSION,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
  MOCK_CODE_VERIFIER,
  MOCK_HOSTNAME,
  MOCK_REDIRECT_URI,
  MOCK_SUB,
  MOCK_USERINFO_PLAINTEXT,
} from './mocks/constants'
import {
  userInfoHandlerMalformedData,
  userInfoHandlerMalformedKey,
  userInfoHandlerNoData,
  userInfoHandlerNoKey,
} from './mocks/handlers'
import { server } from './mocks/server'

describe('SgidClient', () => {
  let client: SgidClient

  beforeAll(() => {
    client = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: MOCK_CLIENT_PRIVATE_KEY,
      redirectUri: MOCK_REDIRECT_URI,
      hostname: MOCK_HOSTNAME,
      apiVersion: MOCK_API_VERSION,
    })
  })

  describe('constructor', () => {
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
        redirectUri: MOCK_REDIRECT_URI,
        hostname: MOCK_HOSTNAME,
        apiVersion: MOCK_API_VERSION,
      })

      expect(pkcs8Client).toBeDefined()
    })
  })

  describe('userinfo', () => {
    it('should call userinfo endpoint and return sub and data', async () => {
      const { sub, data } = await client.userinfo(MOCK_ACCESS_TOKEN)

      expect(sub).toBe(MOCK_SUB)
      expect(data).toEqual(MOCK_USERINFO_PLAINTEXT)
    })

    it('should return empty data object when no key is returned', async () => {
      server.use(userInfoHandlerNoKey)

      const { sub, data } = await client.userinfo(MOCK_ACCESS_TOKEN)

      expect(sub).toBe(MOCK_SUB)
      expect(data).toEqual({})
    })

    it('should return empty data object when no data is returned', async () => {
      server.use(userInfoHandlerNoData)

      const { sub, data } = await client.userinfo(MOCK_ACCESS_TOKEN)

      expect(sub).toBe(MOCK_SUB)
      expect(data).toEqual({})
    })

    it('should throw when private key is invalid', async () => {
      const invalidPrivateKeyClient = new SgidClient({
        clientId: MOCK_CLIENT_ID,
        clientSecret: MOCK_CLIENT_SECRET,
        privateKey: 'malformed',
        redirectUri: MOCK_REDIRECT_URI,
        hostname: MOCK_HOSTNAME,
        apiVersion: MOCK_API_VERSION,
      })

      await expect(
        invalidPrivateKeyClient.userinfo(MOCK_ACCESS_TOKEN),
      ).rejects.toThrow('Failed to import private key')
    })

    it('should throw when encrypted key is malformed', async () => {
      server.use(userInfoHandlerMalformedKey)

      await expect(client.userinfo(MOCK_ACCESS_TOKEN)).rejects.toThrow(
        'Unable to decrypt or import payload key',
      )
    })

    it('should throw when encrypted data is malformed', async () => {
      server.use(userInfoHandlerMalformedData)

      await expect(client.userinfo(MOCK_ACCESS_TOKEN)).rejects.toThrow(
        'Unable to decrypt payload',
      )
    })
  })

  describe('generatePkcePair', () => {
    it('can generate a PKCE pair', () => {
      const pkcePair = client.generatePkcePair()
      expect(pkcePair).toBeDefined()
    })
  })

  describe('generateCodeVerifier', () => {
    it('should generate a code verifier of length 43 when no length is provided', () => {
      const codeVerifier = client.generateCodeVerifier()

      expect(codeVerifier.length).toBe(43)
      expect(codeVerifier).toMatch(codeVerifierAndChallengePattern)
    })

    it('should generate a code verifier of specified length when length between 43 (inclusive) and 128 (inclusive) is provided', () => {
      for (let length = 43; length <= 128; length++) {
        const codeVerifier = client.generateCodeVerifier(length)
        expect(codeVerifier.length).toBe(length)
        expect(codeVerifier).toMatch(codeVerifierAndChallengePattern)
      }
    })

    it('should throw an error when a length < 43 or length > 128 is provided', () => {
      for (const length of [-1, 0, 42, 129, 138, 999]) {
        expect(() => client.generateCodeVerifier(length)).toThrowError(
          `The code verifier should have a minimum length of 43 and a maximum length of 128. Length of ${length} was provided`,
        )
      }
    })
  })

  describe('generateCodeChallenge', () => {
    it('should match the specified pattern', () => {
      expect(client.generateCodeChallenge(MOCK_CODE_VERIFIER)).toMatch(
        codeVerifierAndChallengePattern,
      )
    })

    it('should be deterministic (return the same code challenge given the same code verifier)', () => {
      const firstCodeChallenge =
        client.generateCodeChallenge(MOCK_CODE_VERIFIER)
      const secondCodeChallenge =
        client.generateCodeChallenge(MOCK_CODE_VERIFIER)

      expect(firstCodeChallenge).toBe(secondCodeChallenge)
    })
  })
})

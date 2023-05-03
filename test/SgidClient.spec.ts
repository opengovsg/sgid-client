import { readFileSync } from 'fs'

import SgidClient from '../src'
import {
  DEFAULT_SCOPE,
  DEFAULT_SGID_CODE_CHALLENGE_METHOD,
} from '../src/constants'
import { codeVerifierAndChallengePattern } from '../src/util'

import {
  MOCK_ACCESS_TOKEN,
  MOCK_AUTH_CODE,
  MOCK_AUTH_ENDPOINT,
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
  tokenHandlerNoSub,
  tokenHandlerNoToken,
  userInfoHandlerMalformedData,
  userInfoHandlerMalformedKey,
  userInfoHandlerNoData,
  userInfoHandlerNoKey,
} from './mocks/handlers'
import { server } from './mocks/server'

const DEFAULT_RESPONSE_TYPE = 'code'

describe('SgidClient', () => {
  let client: SgidClient

  beforeAll(() => {
    client = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: MOCK_CLIENT_PRIVATE_KEY,
      redirectUri: MOCK_REDIRECT_URI,
      hostname: MOCK_HOSTNAME,
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
      })

      expect(pkcs8Client).toBeDefined()
    })
  })

  describe('authorizationUrl', () => {
    it('should generate authorisation URL correctly when state and codeChallenge is provided', () => {
      const mockState = 'mockState'
      const mockCodeChallenge = 'mockCodeChallenge'

      const { url, nonce } = client.authorizationUrl({
        state: mockState,
        codeChallenge: mockCodeChallenge,
      })

      const actual = new URL(url)
      // Count number of search params
      let actualNumSearchParams = 0
      actual.searchParams.forEach(() => actualNumSearchParams++)
      const expected = new URL(MOCK_AUTH_ENDPOINT)
      expect(actual.host).toBe(expected.host)
      expect(actual.pathname).toBe(expected.pathname)
      expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
      expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
      expect(actual.searchParams.get('response_type')).toBe(
        DEFAULT_RESPONSE_TYPE,
      )
      expect(actual.searchParams.get('redirect_uri')).toBe(MOCK_REDIRECT_URI)
      expect(actual.searchParams.get('nonce')).toBe(nonce)
      expect(actual.searchParams.get('state')).toBe(mockState)
      expect(actual.searchParams.get('code_challenge')).toBe(mockCodeChallenge)
      expect(actual.searchParams.get('code_challenge_method')).toBe(
        DEFAULT_SGID_CODE_CHALLENGE_METHOD,
      )
      // Client ID, scope, response_type, redirect_uri, nonce, state, code_challenge, code_challenge_method
      expect(actualNumSearchParams).toBe(8)
    })

    it('should generate authorisation URL correctly when state, codeChallenge, and scope is provided as a string', () => {
      const mockState = 'mockState'
      const mockScope = 'mockScope'
      const mockCodeChallenge = 'mockCodeChallenge'

      const { url, nonce } = client.authorizationUrl({
        state: mockState,
        scope: mockScope,
        codeChallenge: mockCodeChallenge,
      })

      const actual = new URL(url)
      // Count number of search params
      let actualNumSearchParams = 0
      actual.searchParams.forEach(() => actualNumSearchParams++)
      const expected = new URL(MOCK_AUTH_ENDPOINT)
      expect(actual.host).toBe(expected.host)
      expect(actual.pathname).toBe(expected.pathname)
      expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
      // Important check is here
      expect(actual.searchParams.get('scope')).toBe(mockScope)
      expect(actual.searchParams.get('response_type')).toBe(
        DEFAULT_RESPONSE_TYPE,
      )
      expect(actual.searchParams.get('redirect_uri')).toBe(MOCK_REDIRECT_URI)
      expect(actual.searchParams.get('nonce')).toBe(nonce)
      expect(actual.searchParams.get('state')).toBe(mockState)
      expect(actual.searchParams.get('code_challenge')).toBe(mockCodeChallenge)
      expect(actual.searchParams.get('code_challenge_method')).toBe(
        DEFAULT_SGID_CODE_CHALLENGE_METHOD,
      )
      // Client ID, scope, response_type, redirect_uri, nonce, state, code_challenge, code_challenge_method
      expect(actualNumSearchParams).toBe(8)
    })

    it('should generate authorisation URL correctly when state, codeChallenge, and scope is provided as a string array', () => {
      const mockState = 'mockState'
      const mockScopes = ['mockScope1', 'mockScope2', 'mockScope3']
      const mockCodeChallenge = 'mockCodeChallenge'

      const { url, nonce } = client.authorizationUrl({
        state: mockState,
        scope: mockScopes,
        codeChallenge: mockCodeChallenge,
      })

      const actual = new URL(url)
      // Count number of search params
      let actualNumSearchParams = 0
      actual.searchParams.forEach(() => actualNumSearchParams++)
      const expected = new URL(MOCK_AUTH_ENDPOINT)
      expect(actual.host).toBe(expected.host)
      expect(actual.pathname).toBe(expected.pathname)
      expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
      // Important check is here
      expect(actual.searchParams.get('scope')).toBe(mockScopes.join(' '))
      expect(actual.searchParams.get('response_type')).toBe(
        DEFAULT_RESPONSE_TYPE,
      )
      expect(actual.searchParams.get('redirect_uri')).toBe(MOCK_REDIRECT_URI)
      expect(actual.searchParams.get('nonce')).toBe(nonce)
      expect(actual.searchParams.get('state')).toBe(mockState)
      expect(actual.searchParams.get('code_challenge')).toBe(mockCodeChallenge)
      expect(actual.searchParams.get('code_challenge_method')).toBe(
        DEFAULT_SGID_CODE_CHALLENGE_METHOD,
      )
      // Client ID, scope, response_type, redirect_uri, nonce, state, code_challenge, code_challenge_method
      expect(actualNumSearchParams).toBe(8)
    })

    it('should generate authorisation URL correctly when state, codeChallenge, and nonce is specified', () => {
      const mockState = 'mockState'
      const mockNonce = 'mockNonce'
      const mockCodeChallenge = 'mockCodeChallenge'

      const { url, nonce } = client.authorizationUrl({
        state: mockState,
        nonce: mockNonce,
        codeChallenge: mockCodeChallenge,
      })

      const actual = new URL(url)
      // Count number of search params
      let actualNumSearchParams = 0
      actual.searchParams.forEach(() => actualNumSearchParams++)
      const expected = new URL(MOCK_AUTH_ENDPOINT)
      expect(actual.host).toBe(expected.host)
      expect(actual.pathname).toBe(expected.pathname)
      expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
      expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
      expect(actual.searchParams.get('response_type')).toBe(
        DEFAULT_RESPONSE_TYPE,
      )
      expect(actual.searchParams.get('redirect_uri')).toBe(MOCK_REDIRECT_URI)
      // Important check is here
      expect(actual.searchParams.get('nonce')).toBe(mockNonce)
      expect(nonce).toBe(mockNonce)
      expect(actual.searchParams.get('state')).toBe(mockState)
      expect(actual.searchParams.get('code_challenge')).toBe(mockCodeChallenge)
      expect(actual.searchParams.get('code_challenge_method')).toBe(
        DEFAULT_SGID_CODE_CHALLENGE_METHOD,
      )
      // Client ID, scope, response_type, redirect_uri, nonce, state, code_challenge, code_challenge_method
      expect(actualNumSearchParams).toBe(8)
    })

    it('should generate authorisation URL correctly when state and codeChallenge is provided and nonce is null', () => {
      const mockState = 'mockState'
      const mockCodeChallenge = 'mockCodeChallenge'

      const { url, nonce } = client.authorizationUrl({
        state: mockState,
        nonce: null,
        codeChallenge: mockCodeChallenge,
      })

      const actual = new URL(url)
      // Count number of search params
      let actualNumSearchParams = 0
      actual.searchParams.forEach(() => actualNumSearchParams++)
      const expected = new URL(MOCK_AUTH_ENDPOINT)
      expect(actual.host).toBe(expected.host)
      expect(actual.pathname).toBe(expected.pathname)
      expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
      expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
      expect(actual.searchParams.get('response_type')).toBe(
        DEFAULT_RESPONSE_TYPE,
      )
      expect(actual.searchParams.get('redirect_uri')).toBe(MOCK_REDIRECT_URI)
      // Important check is here
      expect(actual.searchParams.get('nonce')).toBeNull()
      expect(nonce).toBeUndefined()
      expect(actual.searchParams.get('state')).toBe(mockState)
      expect(actual.searchParams.get('code_challenge')).toBe(mockCodeChallenge)
      expect(actual.searchParams.get('code_challenge_method')).toBe(
        DEFAULT_SGID_CODE_CHALLENGE_METHOD,
      )
      // Client ID, scope, response_type, redirect_uri, state, code_challenge, code_challenge_method
      expect(actualNumSearchParams).toBe(7)
    })

    it('should generate authorisation URL correctly when state, codeChallenge, and redirectUri is provided', () => {
      const mockState = 'mockState'
      const mockRedirectUri = 'https://mockRedirectUri.com'
      const mockCodeChallenge = 'mockCodeChallenge'

      const { url, nonce } = client.authorizationUrl({
        state: mockState,
        redirectUri: mockRedirectUri,
        codeChallenge: mockCodeChallenge,
      })

      const actual = new URL(url)
      // Count number of search params
      let actualNumSearchParams = 0
      actual.searchParams.forEach(() => actualNumSearchParams++)
      const expected = new URL(MOCK_AUTH_ENDPOINT)
      expect(actual.host).toBe(expected.host)
      expect(actual.pathname).toBe(expected.pathname)
      expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
      expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
      expect(actual.searchParams.get('response_type')).toBe(
        DEFAULT_RESPONSE_TYPE,
      )
      // Important check is here
      expect(actual.searchParams.get('redirect_uri')).toBe(mockRedirectUri)
      expect(actual.searchParams.get('nonce')).toBe(nonce)
      expect(actual.searchParams.get('state')).toBe(mockState)
      expect(actual.searchParams.get('code_challenge')).toBe(mockCodeChallenge)
      expect(actual.searchParams.get('code_challenge_method')).toBe(
        DEFAULT_SGID_CODE_CHALLENGE_METHOD,
      )
      // Client ID, scope, response_type, redirect_uri, nonce, state, code_challenge, code_challenge_method
      expect(actualNumSearchParams).toBe(8)
    })

    it('should throw when no redirectUri is provided', () => {
      const mockState = 'mockState'
      const mockCodeChallenge = 'mockCodeChallenge'

      const noRedirectUriClient = new SgidClient({
        clientId: MOCK_CLIENT_ID,
        clientSecret: MOCK_CLIENT_SECRET,
        privateKey: MOCK_CLIENT_PRIVATE_KEY,
        hostname: MOCK_HOSTNAME,
      })

      expect(() =>
        noRedirectUriClient.authorizationUrl({
          state: mockState,
          codeChallenge: mockCodeChallenge,
        }),
      ).toThrow('No redirect URI registered with this client')
    })
  })

  describe('callback', () => {
    it('should call token endpoint and return sub and accessToken', async () => {
      const { sub, accessToken } = await client.callback({
        code: MOCK_AUTH_CODE,
        codeVerifier: MOCK_CODE_VERIFIER,
      })

      expect(sub).toBe(MOCK_SUB)
      expect(accessToken).toBe(MOCK_ACCESS_TOKEN)
    })

    it('should throw when no access token is returned', async () => {
      server.use(tokenHandlerNoToken)

      await expect(
        client.callback({
          code: MOCK_AUTH_CODE,
          codeVerifier: MOCK_CODE_VERIFIER,
        }),
      ).rejects.toThrow('Authorization server did not return an access token')
    })

    it('should throw when sub is empty', async () => {
      server.use(tokenHandlerNoSub)

      await expect(
        client.callback({
          code: MOCK_AUTH_CODE,
          codeVerifier: MOCK_CODE_VERIFIER,
        }),
      ).rejects.toThrow('Authorization server did not return the sub claim')
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
      const pkcePair = SgidClient.generatePkcePair()
      expect(pkcePair).toBeDefined()
    })
  })

  describe('generateCodeVerifier', () => {
    it('should generate a code verifier of length 43 when no length is provided', () => {
      const codeVerifier = SgidClient.generateCodeVerifier()

      expect(codeVerifier.length).toBe(43)
      expect(codeVerifier).toMatch(codeVerifierAndChallengePattern)
    })

    it('should generate a code verifier of specified length when length between 43 (inclusive) and 128 (inclusive) is provided', () => {
      for (let length = 43; length <= 128; length++) {
        const codeVerifier = SgidClient.generateCodeVerifier(length)
        expect(codeVerifier.length).toBe(length)
        expect(codeVerifier).toMatch(codeVerifierAndChallengePattern)
      }
    })

    it('should throw an error when a length < 43 or length > 128 is provided', () => {
      for (const length of [-1, 0, 42, 129, 138, 999]) {
        expect(() => SgidClient.generateCodeVerifier(length)).toThrowError(
          `The code verifier should have a minimum length of 43 and a maximum length of 128`,
        )
      }
    })
  })

  describe('generateCodeChallenge', () => {
    it('should match the specified pattern', () => {
      expect(SgidClient.generateCodeChallenge(MOCK_CODE_VERIFIER)).toMatch(
        codeVerifierAndChallengePattern,
      )
    })

    it('should be deterministic (return the same code challenge given the same code verifier)', () => {
      const firstCodeChallenge =
        SgidClient.generateCodeChallenge(MOCK_CODE_VERIFIER)
      const secondCodeChallenge =
        SgidClient.generateCodeChallenge(MOCK_CODE_VERIFIER)

      expect(firstCodeChallenge).toBe(secondCodeChallenge)
    })
  })
})

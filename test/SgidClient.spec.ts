import { readFileSync } from 'fs'

import SgidClient from '../src'

import {
  MOCK_ACCESS_TOKEN,
  MOCK_API_VERSION,
  MOCK_AUTH_CODE,
  MOCK_AUTH_ENDPOINT,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
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

const DEFAULT_SCOPE = 'myinfo.nric_number openid'
const DEFAULT_RESPONSE_TYPE = 'code'

describe('SgidClient', () => {
  let client: SgidClient

  beforeEach(() => {
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

      const client = new SgidClient({
        clientId: MOCK_CLIENT_ID,
        clientSecret: MOCK_CLIENT_SECRET,
        privateKey: pkcs8Key,
        redirectUri: MOCK_REDIRECT_URI,
        hostname: MOCK_HOSTNAME,
        apiVersion: MOCK_API_VERSION,
      })

      expect(client).toBeDefined()
    })
  })

  describe('authorizationUrl', () => {
    it('should generate authorisation URL correctly when only state is provided', () => {
      const mockState = 'mockState'

      const { url, nonce } = client.authorizationUrl(mockState)

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
      // Client ID, scope, response_type, redirect_uri, nonce, state
      expect(actualNumSearchParams).toBe(6)
    })

    it('should generate authorisation URL correctly when scope is provided as a string', () => {
      const mockState = 'mockState'
      const mockScope = 'mockScope'

      const { url, nonce } = client.authorizationUrl(mockState, mockScope)

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
      // Client ID, scope, response_type, redirect_uri, nonce, state
      expect(actualNumSearchParams).toBe(6)
    })

    it('should generate authorisation URL correctly when scope is provided as a string array', () => {
      const mockState = 'mockState'
      const mockScopes = ['mockScope1', 'mockScope2', 'mockScope3']

      const { url, nonce } = client.authorizationUrl(mockState, mockScopes)

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
      // Client ID, scope, response_type, redirect_uri, nonce, state
      expect(actualNumSearchParams).toBe(6)
    })

    it('should generate authorisation URL correctly when nonce is specified', () => {
      const mockState = 'mockState'
      const mockNonce = 'mockNonce'

      const { url, nonce } = client.authorizationUrl(
        mockState,
        undefined,
        mockNonce,
      )

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
      // Client ID, scope, response_type, redirect_uri, nonce, state
      expect(actualNumSearchParams).toBe(6)
    })

    it('should generate authorisation URL correctly when nonce is null', () => {
      const mockState = 'mockState'

      const { url, nonce } = client.authorizationUrl(mockState, undefined, null)

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
      // Client ID, scope, response_type, redirect_uri, state
      expect(actualNumSearchParams).toBe(5)
    })

    it('should generate authorisation URL correctly when redirectUri is provided', () => {
      const mockState = 'mockState'
      const mockRedirectUri = 'https://mockRedirectUri.com'

      const { url, nonce } = client.authorizationUrl(
        mockState,
        undefined,
        undefined,
        mockRedirectUri,
      )

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
      // Client ID, scope, response_type, redirect_uri, nonce, state
      expect(actualNumSearchParams).toBe(6)
    })

    it('should throw when no redirectUri is provided', () => {
      const mockState = 'mockState'

      const client = new SgidClient({
        clientId: MOCK_CLIENT_ID,
        clientSecret: MOCK_CLIENT_SECRET,
        privateKey: MOCK_CLIENT_PRIVATE_KEY,
        hostname: MOCK_HOSTNAME,
        apiVersion: MOCK_API_VERSION,
      })

      expect(() => client.authorizationUrl(mockState)).toThrow(
        'No redirect URI registered with this client',
      )
    })
  })

  describe('callback', () => {
    it('should call token endpoint and return sub and accessToken', async () => {
      const { sub, accessToken } = await client.callback(MOCK_AUTH_CODE)

      expect(sub).toBe(MOCK_SUB)
      expect(accessToken).toBe(MOCK_ACCESS_TOKEN)
    })

    it('should throw when no access token is returned', async () => {
      server.use(tokenHandlerNoToken)

      await expect(client.callback(MOCK_AUTH_CODE)).rejects.toThrow(
        'Missing sub claim or access token',
      )
    })

    it('should throw when sub is empty', async () => {
      server.use(tokenHandlerNoSub)

      await expect(client.callback(MOCK_AUTH_CODE)).rejects.toThrow(
        'Missing sub claim or access token',
      )
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
      const client = new SgidClient({
        clientId: MOCK_CLIENT_ID,
        clientSecret: MOCK_CLIENT_SECRET,
        privateKey: 'malformed',
        redirectUri: MOCK_REDIRECT_URI,
        hostname: MOCK_HOSTNAME,
        apiVersion: MOCK_API_VERSION,
      })

      await expect(client.userinfo(MOCK_ACCESS_TOKEN)).rejects.toThrow(
        'Failed to import private key',
      )
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
})

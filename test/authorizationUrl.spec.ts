import { SgidClient } from '../src'
import {
  DEFAULT_RESPONSE_TYPE,
  DEFAULT_SCOPE,
  DEFAULT_SGID_CODE_CHALLENGE_METHOD,
} from '../src/constants'

import {
  MOCK_AUTH_ENDPOINT_V2,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
  MOCK_HOSTNAME,
  MOCK_REDIRECT_URI,
} from './mocks/constants'

describe('SgidClient: authorizationUrl (with PKCE)', () => {
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
    const expected = new URL(MOCK_AUTH_ENDPOINT_V2)
    expect(actual.host).toBe(expected.host)
    expect(actual.pathname).toBe(expected.pathname)
    expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
    expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    const expected = new URL(MOCK_AUTH_ENDPOINT_V2)
    expect(actual.host).toBe(expected.host)
    expect(actual.pathname).toBe(expected.pathname)
    expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
    // Important check is here
    expect(actual.searchParams.get('scope')).toBe(mockScope)
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    const expected = new URL(MOCK_AUTH_ENDPOINT_V2)
    expect(actual.host).toBe(expected.host)
    expect(actual.pathname).toBe(expected.pathname)
    expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
    // Important check is here
    expect(actual.searchParams.get('scope')).toBe(mockScopes.join(' '))
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    const expected = new URL(MOCK_AUTH_ENDPOINT_V2)
    expect(actual.host).toBe(expected.host)
    expect(actual.pathname).toBe(expected.pathname)
    expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
    expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    const expected = new URL(MOCK_AUTH_ENDPOINT_V2)
    expect(actual.host).toBe(expected.host)
    expect(actual.pathname).toBe(expected.pathname)
    expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
    expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    const expected = new URL(MOCK_AUTH_ENDPOINT_V2)
    expect(actual.host).toBe(expected.host)
    expect(actual.pathname).toBe(expected.pathname)
    expect(actual.searchParams.get('client_id')).toBe(MOCK_CLIENT_ID)
    expect(actual.searchParams.get('scope')).toBe(DEFAULT_SCOPE)
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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

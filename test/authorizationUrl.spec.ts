import SgidClient, {
  DEFAULT_SCOPE,
  DEFAULT_SGID_CODE_CHALLENGE_METHOD,
} from '../src'

import {
  MOCK_API_VERSION,
  MOCK_API_VERSION_V2,
  MOCK_AUTH_ENDPOINT,
  MOCK_AUTH_ENDPOINT_V2,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_PRIVATE_KEY,
  MOCK_CLIENT_SECRET,
  MOCK_HOSTNAME,
  MOCK_REDIRECT_URI,
} from './mocks/constants'

const DEFAULT_RESPONSE_TYPE = 'code'

describe('authorizationUrl (v1)', () => {
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
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
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
    expect(actual.searchParams.get('response_type')).toBe(DEFAULT_RESPONSE_TYPE)
    // Important check is here
    expect(actual.searchParams.get('redirect_uri')).toBe(mockRedirectUri)
    expect(actual.searchParams.get('nonce')).toBe(nonce)
    expect(actual.searchParams.get('state')).toBe(mockState)
    // Client ID, scope, response_type, redirect_uri, nonce, state
    expect(actualNumSearchParams).toBe(6)
  })

  it('should throw when no redirectUri is provided', () => {
    const mockState = 'mockState'

    const noRedirectUriClient = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: MOCK_CLIENT_PRIVATE_KEY,
      hostname: MOCK_HOSTNAME,
      apiVersion: MOCK_API_VERSION,
    })

    expect(() => noRedirectUriClient.authorizationUrl(mockState)).toThrow(
      'No redirect URI registered with this client',
    )
  })
})

describe('authorizationUrl (v2 with PKCE)', () => {
  let v2Client: SgidClient

  beforeAll(() => {
    v2Client = new SgidClient({
      clientId: MOCK_CLIENT_ID,
      clientSecret: MOCK_CLIENT_SECRET,
      privateKey: MOCK_CLIENT_PRIVATE_KEY,
      redirectUri: MOCK_REDIRECT_URI,
      hostname: MOCK_HOSTNAME,
      apiVersion: MOCK_API_VERSION_V2,
    })
  })

  it('should generate authorisation URL correctly when state and codeChallenge is provided', () => {
    const mockState = 'mockState'
    const mockCodeChallenge = 'mockCodeChallenge'

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      undefined,
      undefined,
      undefined,
      mockCodeChallenge,
      undefined,
    )

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

  it('should generate authorisation URL correctly when state, codeChallenge, and codeChallengeMethod is provided', () => {
    const mockState = 'mockState'
    const mockCodeChallenge = 'mockCodeChallenge'
    const mockCodeChallengeMethod = 'plain'

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      undefined,
      undefined,
      undefined,
      mockCodeChallenge,
      mockCodeChallengeMethod,
    )

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
    // Important check is here
    expect(actual.searchParams.get('code_challenge_method')).toBe(
      mockCodeChallengeMethod,
    )
    // Client ID, scope, response_type, redirect_uri, nonce, state, code_challenge, code_challenge_method
    expect(actualNumSearchParams).toBe(8)
  })

  it('should generate authorisation URL correctly when state, codeChallenge, and scope is provided as a string', () => {
    const mockState = 'mockState'
    const mockScope = 'mockScope'
    const mockCodeChallenge = 'mockCodeChallenge'

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      mockScope,
      undefined,
      undefined,
      mockCodeChallenge,
      undefined,
    )

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

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      mockScopes,
      undefined,
      undefined,
      mockCodeChallenge,
      undefined,
    )

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

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      undefined,
      mockNonce,
      undefined,
      mockCodeChallenge,
      undefined,
    )

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

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      undefined,
      null,
      undefined,
      mockCodeChallenge,
      undefined,
    )

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

    const { url, nonce } = v2Client.authorizationUrl(
      mockState,
      undefined,
      undefined,
      mockRedirectUri,
      mockCodeChallenge,
      undefined,
    )

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
      apiVersion: MOCK_API_VERSION_V2,
    })

    expect(() =>
      noRedirectUriClient.authorizationUrl(
        mockState,
        undefined,
        undefined,
        undefined,
        mockCodeChallenge,
        undefined,
      ),
    ).toThrow('No redirect URI registered with this client')
  })
})

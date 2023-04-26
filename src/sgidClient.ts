import { Client, generators, Issuer } from 'openid-client'

import {
  API_VERSION,
  DEFAULT_SCOPE,
  DEFAULT_SGID_CODE_CHALLENGE_METHOD,
  SGID_AUTH_METHOD,
  SGID_SIGNING_ALG,
  SGID_SUPPORTED_FLOWS,
} from './constants'
import {
  AuthorizationUrlParams,
  AuthorizationUrlReturn,
  CallbackParams,
  ConstructorParams,
} from './types'
import { convertPkcs1ToPkcs8, decryptPayload } from './util'

export class SgidClient {
  private apiVersion: number
  private privateKey: string
  private sgID: Client

  constructor({
    clientId,
    clientSecret,
    privateKey,
    redirectUris,
    hostname = 'https://api.id.gov.sg',
  }: ConstructorParams) {
    this.apiVersion = API_VERSION

    // TODO: Discover sgID issuer metadata via .well-known endpoint
    const { Client } = new Issuer({
      issuer: new URL(hostname).origin,
      authorization_endpoint: `${hostname}/v${this.apiVersion}/oauth/authorize`,
      token_endpoint: `${hostname}/v${this.apiVersion}/oauth/token`,
      userinfo_endpoint: `${hostname}/v${this.apiVersion}/oauth/userinfo`,
      jwks_uri: `${new URL(hostname).origin}/.well-known/jwks.json`,
    })

    this.sgID = new Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: redirectUris,
      id_token_signed_response_alg: SGID_SIGNING_ALG,
      response_types: SGID_SUPPORTED_FLOWS,
      token_endpoint_auth_method: SGID_AUTH_METHOD,
    })

    /**
     * For backward compatibility with pkcs1
     */
    if (privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')) {
      this.privateKey = convertPkcs1ToPkcs8(privateKey)
    } else {
      this.privateKey = privateKey
    }

    /**
     * To rectify instances where an extra '\' escape character is added to the newline
     */
    this.privateKey = this.privateKey.replace(/\\n/gm, '\n')
  }

  /**
   * Generates authorization url for sgID OIDC flow
   * @param state A random string to prevent CSRF
   * @param scopes Array or space-separated scopes, must include openid
   * @param nonce Specify null if no nonce
   * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
   * @param codeChallenge The code challenge from the code verifier used for PKCE enhancement
   * @returns
   */
  authorizationUrl({
    state,
    scope = DEFAULT_SCOPE,
    nonce = generators.nonce(),
    redirectUri = this.getFirstRedirectUri(),
    codeChallenge,
  }: AuthorizationUrlParams): AuthorizationUrlReturn {
    if (this.apiVersion !== 2) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error(
        `ApiVersion ${this.apiVersion} provided is invalid for function 'authorizationUrl'`,
      )
    }

    if (codeChallenge === undefined) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error("Code challenge must be provided in 'authorizationUrl'")
    }

    const url = this.sgID.authorizationUrl({
      scope: typeof scope === 'string' ? scope : scope.join(' '),
      nonce: nonce ?? undefined,
      state,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: DEFAULT_SGID_CODE_CHALLENGE_METHOD,
    })

    const result: { url: string; nonce?: string } = { url }
    if (nonce) {
      result.nonce = nonce
    }
    return result
  }

  private getFirstRedirectUri(): string {
    if (
      !this.sgID.metadata.redirect_uris ||
      this.sgID.metadata.redirect_uris.length === 0
    ) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error('No redirect URI registered with this client')
    }
    return this.sgID.metadata.redirect_uris[0]
  }

  /**
   * Callback handler for sgID OIDC flow
   * @param code The authorization code received from the authorization server
   * @param nonce Specify null if no nonce
   * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
   * @param codeVerifier The code verifier that was used to generate the code challenge that was passed in `authorizationUrl`
   * @returns The sub of the user and access token
   */
  async callback({
    code,
    nonce = null,
    redirectUri = this.getFirstRedirectUri(),
    codeVerifier,
  }: CallbackParams): Promise<{ sub: string; accessToken: string }> {
    if (this.apiVersion !== 2) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error(
        "Code verifier must be provided in 'callback' when using apiVersion 2",
      )
    }

    if (codeVerifier === undefined) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error(
        "Code verifier must be provided in 'callback' when using apiVersion 2",
      )
    }

    const tokenSet = await this.sgID.callback(
      redirectUri,
      { code },
      { nonce: nonce ?? undefined, code_verifier: codeVerifier },
    )
    const { sub } = tokenSet.claims()
    const { access_token: accessToken } = tokenSet
    if (!sub || !accessToken) {
      throw new Error('Missing sub claim or access token')
    }
    return { sub, accessToken }
  }

  /**
   * Retrieve verified user info and decrypt with client's private key
   * @param accessToken The access token returned in the callback function
   * @returns The sub of the user and data
   */
  async userinfo(
    accessToken: string,
  ): Promise<{ sub: string; data: Record<string, string> }> {
    /**
     * sub: user sub (also returned previously in id_token)
     * encryptedPayloadKey: key encrypted with client's public key (for decrypting userinfo jwe)
     * data: jwe of userinfo
     */
    const {
      sub,
      key: encryptedPayloadKey,
      data,
    } = await this.sgID.userinfo<{
      sub: string | undefined
      key: string | undefined
      data: Record<string, string> | undefined
    }>(accessToken)

    if (encryptedPayloadKey && data) {
      const result = await decryptPayload(
        this.privateKey,
        encryptedPayloadKey,
        data,
      )
      return { sub, data: result }
    }

    return { sub, data: {} }
  }
}

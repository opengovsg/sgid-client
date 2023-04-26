import { compactDecrypt, importJWK, importPKCS8 } from 'jose'
import { Client, generators, Issuer } from 'openid-client'

import {
  API_VERSION,
  DEFAULT_SCOPE,
  DEFAULT_SGID_CODE_CHALLENGE_METHOD,
  SGID_AUTH_METHOD,
  SGID_SIGNING_ALG,
  SGID_SUPPORTED_FLOWS,
} from './constants'
import * as Errors from './error'
import { convertPkcs1ToPkcs8 } from './util'

type AuthorizationUrlParams = {
  state: string
  scope?: string | string[]
  nonce?: string | null
  redirectUri?: string
  codeChallenge: string
}

type AuthorizationUrlReturn = { url: string; nonce?: string }

type CallbackParams = {
  code: string
  nonce?: string | null
  redirectUri?: string
  codeVerifier?: string
}

// Exported for RPs' convenience, e.g. if they want to
// write a function to construct the params
export type SgidClientParams = {
  clientId: string
  clientSecret: string
  privateKey: string
  redirectUris?: string[]
  hostname?: string
  apiVersion?: number
}

export class SgidClient {
  private apiVersion: number
  private privateKey: string
  private sgID: Client

  /**
   * Initialises an SgidClient instance.
   * @param params Constructor arguments
   * @param params.clientId Client ID provided during client registration
   * @param params.clientSecret Client secret provided during client registration
   * @param params.privateKey Client private key provided during client registration
   * @param params.redirectUri Redirection URI for user to return to your application
   * after login. If not provided in the constructor, this must be provided to the
   * authorizationUrl and callback functions.
   * @param params.hostname Hostname of OpenID provider (sgID). Defaults to
   * https://api.id.gov.sg.
   * @param params.apiVersion sgID API version to use. Defaults to 1.
   */
  constructor({
    clientId,
    clientSecret,
    privateKey,
    redirectUris,
    hostname = 'https://api.id.gov.sg',
  }: SgidClientParams) {
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
   * Generates authorization url to redirect end-user to sgID login page.
   * @param state A string which will be passed back to your application once the end-user
   * logs in. You should use this to prevent cross-site request forgery attacks (see
   * https://www.rfc-editor.org/rfc/rfc6749#section-10.12). You can also use this to
   * track per-request state.
   * @param scopes Array or space-separated scopes. 'openid' must be provided as a scope.
   * Defaults to 'myinfo.nric_number openid'.
   * @param nonce Unique nonce for this request. If this param is undefined, a nonce is generated
   * and returned. To prevent this behaviour, specify null for this param.
   * @param redirectUri The redirect URI used in the authorization request. Defaults to the one
   * passed to the SgidClient constructor.
   * @param codeChallenge The code challenge from the code verifier used for PKCE enhancement
   */
  authorizationUrl({
    state,
    scope = DEFAULT_SCOPE,
    nonce = generators.nonce(),
    redirectUri = this.getFirstRedirectUri(),
    codeChallenge,
  }: AuthorizationUrlParams): AuthorizationUrlReturn {
    if (this.apiVersion !== 2) {
      throw new Error(
        `ApiVersion ${this.apiVersion} provided is invalid for function 'authorizationUrl'`,
      )
    }

    if (codeChallenge === undefined) {
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
      throw new Error(Errors.MISSING_REDIRECT_URI_ERROR)
    }
    return this.sgID.metadata.redirect_uris[0]
  }

  /**
   * Exchanges authorization code for access token.
   * @param code The authorization code received from the authorization server
   * @param nonce Nonce passed to authorizationUrl for this request. Specify null
   * if no nonce was passed to authorizationUrl.
   * @param redirectUri The redirect URI used in the authorization request. Defaults to the one
   * passed to the SgidClient constructor.
   * @param codeVerifier The code verifier that was used to generate the code challenge that was passed in `authorizationUrl`
   * @returns The sub (subject identifier claim) of the user and access token. The subject
   * identifier claim is the end-user's unique ID.
   */
  async callback({
    code,
    nonce = null,
    redirectUri = this.getFirstRedirectUri(),
    codeVerifier,
  }: CallbackParams): Promise<{ sub: string; accessToken: string }> {
    if (this.apiVersion !== 2) {
      throw new Error(
        "Code verifier must be provided in 'callback' when using apiVersion 2",
      )
    }

    if (codeVerifier === undefined) {
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
    if (!sub) {
      throw new Error(Errors.NO_SUB_ERROR)
    }
    if (!accessToken) {
      throw new Error(Errors.NO_ACCESS_TOKEN_ERROR)
    }
    return { sub, accessToken }
  }

  /**
   * Retrieves verified user info and decrypts it with your private key.
   * @param accessToken The access token returned in the callback function
   * @returns The sub of the end-user and the end-user's verified data
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
      const result = await this.decryptPayload(encryptedPayloadKey, data)
      return { sub, data: result }
    }

    return { sub, data: {} }
  }

  private async decryptPayload(
    encryptedPayloadKey: string,
    data: Record<string, string>,
  ): Promise<Record<string, string>> {
    let privateKeyJwk
    let payloadJwk
    try {
      // Import client private key in PKCS8 format
      privateKeyJwk = await importPKCS8(this.privateKey, 'RSA-OAEP-256')
    } catch (e) {
      throw new Error(Errors.PRIVATE_KEY_IMPORT_ERROR)
    }

    // Decrypt key to get plaintext symmetric key
    const decoder = new TextDecoder()
    try {
      const decryptedKey = decoder.decode(
        (await compactDecrypt(encryptedPayloadKey, privateKeyJwk)).plaintext,
      )
      payloadJwk = await importJWK(JSON.parse(decryptedKey))
    } catch (e) {
      throw new Error(Errors.DECRYPT_BLOCK_KEY_ERROR)
    }

    // Decrypt each jwe in body
    const result: Record<string, string> = {}
    try {
      for (const field in data) {
        const jwe = data[field]
        const decryptedValue = decoder.decode(
          (await compactDecrypt(jwe, payloadJwk)).plaintext,
        )
        result[field] = decryptedValue
      }
    } catch (e) {
      throw new Error(Errors.DECRYPT_PAYLOAD_ERROR)
    }
    return result
  }

  /**
   * Generates a PKCE challenge pair where `codeChallenge` is the generated S256 challenge from `codeVerifier`
   * @param length The length of the code verifier
   * @returns The generated challenge pair
   */
  static generatePkcePair(length = 43): {
    codeVerifier: string
    codeChallenge: string
  } {
    const codeVerifier = this.generateCodeVerifier(length)
    const codeChallenge = this.generateCodeChallenge(codeVerifier)

    return { codeVerifier, codeChallenge }
  }

  /**
   * Generates the code verifier (random bytes encoded in url safe base 64) to be used in the OAuth 2.0 PKCE flow
   * @param length The length of the code verifier to generate (Defaults to 43 if not provided)
   * @returns The generated code verifier
   */
  static generateCodeVerifier(length = 43): string {
    if (length < 43 || length > 128) {
      throw new Error(
        `The code verifier should have a minimum length of 43 and a maximum length of 128. Length of ${length} was provided`,
      )
    }

    // 96 bytes results in a 128 long base64 string
    const codeVerifier = generators.codeVerifier(96)

    // This works because a prefix of a random string is still random
    return codeVerifier.slice(0, length)
  }

  /**
   * Calculates the S256 PKCE code challenge for a provided code verifier
   * @param codeVerifier The code verifier to calculate the S256 code challenge for
   * @returns The calculated code challenge
   */
  static generateCodeChallenge(codeVerifier: string): string {
    return generators.codeChallenge(codeVerifier)
  }
}

export default SgidClient

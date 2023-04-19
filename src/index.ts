import { compactDecrypt, importJWK, importPKCS8 } from 'jose'
import {
  Client,
  ClientAuthMethod,
  generators,
  Issuer,
  ResponseType,
} from 'openid-client'

import * as Errors from './error'
import { convertPkcs1ToPkcs8 } from './util'

const SGID_SIGNING_ALG = 'RS256'
export const DEFAULT_SGID_CODE_CHALLENGE_METHOD = 'S256'
export const DEFAULT_SCOPE = 'myinfo.nric_number openid'
const SGID_SUPPORTED_FLOWS: ResponseType[] = ['code']
const SGID_AUTH_METHOD: ClientAuthMethod = 'client_secret_post'

// Exported for RPs' convenience, e.g. if they want to
// write a function to construct the params
export type SgidClientParams = {
  clientId: string
  clientSecret: string
  privateKey: string
  redirectUri?: string
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
    redirectUri,
    hostname = 'https://api.id.gov.sg',
    apiVersion = 1,
  }: SgidClientParams) {
    this.apiVersion = apiVersion
    // TODO: Discover sgID issuer metadata via .well-known endpoint
    const { Client } = new Issuer({
      issuer: new URL(hostname).origin,
      authorization_endpoint: `${hostname}/v${apiVersion}/oauth/authorize`,
      token_endpoint: `${hostname}/v${apiVersion}/oauth/token`,
      userinfo_endpoint: `${hostname}/v${apiVersion}/oauth/userinfo`,
      jwks_uri: `${new URL(hostname).origin}/.well-known/jwks.json`,
    })

    this.sgID = new Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: redirectUri ? [redirectUri] : undefined,
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
  }

  /**
<<<<<<< HEAD
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
=======
   * Generates authorization url for sgID OIDC flow
   * @param state A random string to prevent CSRF
   * @param scopes Array or space-separated scopes, must include openid
   * @param nonce Specify null if no nonce
   * @param redirectUri The
   * @param codeChallenge The code challenge from the code verifier used for PKCE enhancement
   * @param codeChallengeMethod The code challenge method used to generate the code challenge from the code verifier, must be `S256` redirect URI used in the authorization request, defaults to the one registered with the client
   * @returns
>>>>>>> 3f3e979 (docs: add jdocs for codeChallenge and codeChallengeMethod)
   */
  authorizationUrl(
    state: string,
    scope: string | string[] = DEFAULT_SCOPE,
    nonce: string | null = generators.nonce(),
    redirectUri: string = this.getFirstRedirectUri(),
    codeChallenge?: string,
    codeChallengeMethod: 'plain' | 'S256' = DEFAULT_SGID_CODE_CHALLENGE_METHOD,
  ): { url: string; nonce?: string } {
    switch (this.apiVersion) {
      case 1:
        return this.authorizationUrlV1({ state, scope, nonce, redirectUri })

      case 2:
        return this.authorizationUrlV2({
          state,
          scope,
          nonce,
          redirectUri,
          codeChallenge,
          codeChallengeMethod,
        })

      default:
        // eslint-disable-next-line typesafe/no-throw-sync-func
        throw new Error(`ApiVersion ${this.apiVersion} provided is invalid`)
    }
  }

  private authorizationUrlV1({
    state,
    scope,
    nonce,
    redirectUri,
  }: {
    state: string
    scope: string | string[]
    nonce: string | null
    redirectUri: string
  }): { url: string; nonce?: string } {
    const url = this.sgID.authorizationUrl({
      scope: typeof scope === 'string' ? scope : scope.join(' '),
      nonce: nonce ?? undefined,
      state,
      redirect_uri: redirectUri,
    })
    const result: { url: string; nonce?: string } = { url }
    if (nonce) {
      result.nonce = nonce
    }
    return result
  }

  private authorizationUrlV2({
    state,
    scope,
    nonce,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
  }: {
    state: string
    scope: string | string[]
    nonce: string | null
    redirectUri: string
    codeChallenge?: string
    codeChallengeMethod: 'plain' | 'S256'
  }): { url: string; nonce?: string } {
    if (codeChallenge === undefined) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error('Code challenge must be provided when using apiVersion 2')
    }

    const url = this.sgID.authorizationUrl({
      scope: typeof scope === 'string' ? scope : scope.join(' '),
      nonce: nonce ?? undefined,
      state,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
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
   * @returns The sub (subject identifier claim) of the user and access token. The subject
   * identifier claim is the end-user's unique ID.
   */
  async callback(
    code: string,
    nonce: string | null = null,
    redirectUri = this.getFirstRedirectUri(),
  ): Promise<{ sub: string; accessToken: string }> {
    const tokenSet = await this.sgID.callback(
      redirectUri,
      { code },
      { nonce: nonce ?? undefined },
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
  generatePkcePair(length = 43): {
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
  generateCodeVerifier(length = 43): string {
    if (length < 43 || length > 128) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
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
  generateCodeChallenge(codeVerifier: string): string {
    return generators.codeChallenge(codeVerifier)
  }
}

export default SgidClient

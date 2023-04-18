import { compactDecrypt, importJWK, importPKCS8 } from 'jose'
import {
  Client,
  ClientAuthMethod,
  generators,
  Issuer,
  ResponseType,
} from 'openid-client'

import { convertPkcs1ToPkcs8 } from './util'

const SGID_SIGNING_ALG = 'RS256'
const SGID_SUPPORTED_FLOWS: ResponseType[] = ['code']
const SGID_AUTH_METHOD: ClientAuthMethod = 'client_secret_post'

export class SgidClient {
  private privateKey: string

  private sgID: Client

  constructor({
    clientId,
    clientSecret,
    privateKey,
    redirectUri,
    hostname = 'https://api.id.gov.sg',
    apiVersion = 1,
  }: {
    clientId: string
    clientSecret: string
    privateKey: string
    redirectUri?: string
    hostname?: string
    apiVersion?: number
  }) {
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
   * Generates authorization url for sgID OIDC flow
   * @param state A random string to prevent CSRF
   * @param scopes Array or space-separated scopes, must include openid
   * @param nonce Specify null if no nonce
   * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
   * @returns
   */
  authorizationUrl(
    state: string,
    scope: string | string[] = 'myinfo.nric_number openid',
    nonce: string | null = generators.nonce(),
    redirectUri: string = this.getFirstRedirectUri(),
  ): { url: string; nonce?: string } {
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
   * @returns The sub of the user and access token
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
      throw new Error('Failed to import private key')
    }

    // Decrypt key to get plaintext symmetric key
    const decoder = new TextDecoder()
    try {
      const decryptedKey = decoder.decode(
        (await compactDecrypt(encryptedPayloadKey, privateKeyJwk)).plaintext,
      )
      payloadJwk = await importJWK(JSON.parse(decryptedKey))
    } catch (e) {
      throw new Error('Unable to decrypt or import payload key')
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
      throw new Error('Unable to decrypt payload')
    }
    return result
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

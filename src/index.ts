import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import { JWE, JWK } from 'node-jose'
import { Client, generators, Issuer } from 'openid-client'

const RS256 = 'RS256'

export class SgidClient {
  private privateKey: string | Buffer

  private sgID: Client

  constructor({
    endpoint,
    clientId,
    clientSecret,
    privateKey,
    redirectUri,
  }: {
    endpoint: string
    clientId: string
    clientSecret: string
    privateKey: string | Buffer
    redirectUri: string
  }) {
    this.privateKey = privateKey

    const { origin: issuer } = new URL(endpoint)

    // TODO: Discover sgID issuer metadata via .well-known endpoint
    const { Client } = new Issuer({
      issuer,
      authorization_endpoint: `${endpoint}/authorize`,
      token_endpoint: `${endpoint}/token`,
      userinfo_endpoint: `${endpoint}/userinfo`,
      jwks_uri: `${issuer}/.well-known/jwks.json`,
    })

    this.sgID = new Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
    })
  }

  authorizationUrl(state: string, scope = 'myinfo.nric_number openid'): string {
    // TODO: remember nonce to validate callback
    const nonce = generators.nonce()
    return this.sgID.authorizationUrl({
      scope,
      nonce,
      state,
    })
  }

  getRedirectUri(): string {
    if (
      !this.sgID.metadata.redirect_uris ||
      this.sgID.metadata.redirect_uris.length === 0
    ) {
      // eslint-disable-next-line typesafe/no-throw-sync-func
      throw new Error('No redirect URI registered with this client')
    }
    return this.sgID.metadata.redirect_uris[0]
  }

  decodeIdToken(token: string): string {
    // parse payload and retrieve sub
    const { sub } = jwtDecode<{ sub: string }>(token)
    return sub
  }

  async callback(
    code: string,
    redirectUri: string = this.getRedirectUri(),
  ): Promise<{ sub: string; accessToken: string }> {
    const { client_id, client_secret } = this.sgID.metadata
    // TODO: implement checks for nonce, maxAge
    return this.sgID
      .callback(redirectUri, { code }, undefined, {
        exchangeBody: {
          aud: client_id,
          client_id,
          client_secret,
        },
      })
      .then(({ access_token, id_token: idToken }) => {
        const sub = this.decodeIdToken(`${idToken}`)
        const accessToken = `${access_token}`
        return { sub, accessToken }
      })
  }

  async userinfo(
    accessToken: string,
  ): Promise<{ sub: string; data: Record<string, string> }> {
    return this.sgID
      .userinfo<{ sub: string; key: string; data: Record<string, string> }>(
        accessToken,
      )
      .then(async ({ sub, key: encryptedPayloadKey, data }) => {
        const privateKey = await JWK.asKey(this.privateKey, 'pem')
        const { plaintext: payloadKey } = await JWE.createDecrypt(
          privateKey,
        ).decrypt(encryptedPayloadKey)

        const decryptedKey = await JWK.asKey(payloadKey, 'json')

        const result: Record<string, string> = {}
        for (const [key, ciphertext] of Object.entries(data)) {
          const { plaintext } = await JWE.createDecrypt(decryptedKey).decrypt(
            ciphertext,
          )
          const value = plaintext.toString('ascii')
          result[key] = value
        }

        return { sub, data: result }
      })
  }

  createJWT(payload: Record<string, unknown>, expiresIn: number): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: RS256,
      expiresIn,
    })
  }

  verifyJWT(
    token: string,
    publicKey: string | Buffer,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): string | object | undefined {
    return jwt.verify(token, publicKey, {
      algorithms: [RS256],
    })
  }
}

export default SgidClient

import fs from 'fs'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import { JWE, JWK } from 'node-jose'
import { Client, generators, Issuer } from 'openid-client'

const isKey = (key: string) => key.startsWith('-----BEGIN')
const RS256 = 'RS256'

export class SgidClient {
  private privateKey: string | Buffer
  private publicKey: string | Buffer

  private sgID: Client

  constructor({
    endpoint,
    clientId,
    clientSecret,
    privateKey,
    publicKey,
    redirectUri,
  }: {
    endpoint: string
    clientId: string
    clientSecret: string
    privateKey: string
    publicKey: string
    redirectUri: string
  }) {
    this.privateKey = isKey(privateKey)
      ? privateKey
      : fs.readFileSync(privateKey)
    this.publicKey = isKey(publicKey) ? publicKey : fs.readFileSync(publicKey)

    // TODO: Discover sgID issuer metadata via .well-known endpoint
    const issuer = new Issuer({
      issuer: 'sgID',
      authorization_endpoint: `${endpoint}/authorize`,
      token_endpoint: `${endpoint}/token`,
      userinfo_endpoint: `${endpoint}/userinfo`,
    })

    this.sgID = new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
    })
  }

  authorizationUrl(state: string): string {
    const nonce = generators.nonce()
    return this.sgID.authorizationUrl({
      scope: 'myinfo.nric_number openid',
      nonce,
      state,
    })
  }

  decodeIdToken(token: string): string {
    // TODO verify id_token
    // parse payload and retrieve sub
    const { sub } = jwtDecode<{ sub: string }>(token)
    return sub
  }

  async callback(code: string): Promise<{ sub: string; accessToken: string }> {
    return this.sgID
      .callback(undefined, { code })
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  verifyJWT(token: string): string | object {
    return jwt.verify(token, this.publicKey, {
      algorithms: [RS256],
    })
  }
}

export default SgidClient

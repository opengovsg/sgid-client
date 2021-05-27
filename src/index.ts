import axios from 'axios'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import { JWE, JWK } from 'node-jose'

const isKey = (key: string) => key.startsWith('-----BEGIN')
const RS256 = 'RS256'

export class SgidClient {
  private endpoint: string
  private clientId: string
  private clientSecret: string
  private privateKey: string | Buffer
  private publicKey: string | Buffer
  private redirectUri: string

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
    this.endpoint = endpoint
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.privateKey = isKey(privateKey)
      ? privateKey
      : fs.readFileSync(privateKey)
    this.publicKey = isKey(publicKey) ? publicKey : fs.readFileSync(publicKey)
    this.redirectUri = redirectUri
  }

  authorizationUrl(state: string): string {
    return `${this.endpoint}/authorize?redirect_uri=${this.redirectUri}&client_id=${this.clientId}&state=${state}&response_type=code&scope=myinfo.nric_number%20openid&nonce=randomnonce`
  }

  decodeIdToken(token: string): string {
    // TODO verify id_token
    // parse payload and retrieve sub
    const { sub } = jwtDecode<{ sub: string }>(token)
    return sub
  }

  async callback(code: string): Promise<{ sub: string; accessToken: string }> {
    return axios
      .post<{ access_token: string; id_token: string }>(
        `${this.endpoint}/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
          code,
        },
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then((response) => response.data)
      .then(({ access_token: accessToken, id_token: idToken }) => {
        const sub = this.decodeIdToken(idToken)
        return { sub, accessToken }
      })
  }

  async userinfo(
    accessToken: string,
  ): Promise<{ sub: string; data: Record<string, string> }> {
    return axios
      .get<{ sub: string; key: string; data: Record<string, string> }>(
        `${this.endpoint}/userinfo`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => response.data)
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

import { Issuer } from 'openid-client'

import {
  SGID_AUTH_METHOD,
  SGID_SIGNING_ALG,
  SGID_SUPPORTED_GRANT_TYPES,
} from '../../../../../dist/constants'
import { SgidClient } from '../../../../../dist/SgidClient'

const clientId = 'sgid-conformance-test'
const clientSecret =
  'sgid-conformance-test-secret-that-should-be-at-least-256-bits-long'

// Ensure that the last path parameter matches the alias in `test/conformance/suite/test.py`
const hostname =
  'https://www.certification.openid.net/test/a/sgid-sdk-test-rayner-2'
const redirectUri = 'http://localhost:3000/api/callback'

class ConformanceSgidClient extends SgidClient {
  constructor() {
    super({
      clientId,
      clientSecret,
      privateKey: 'dummy',
      redirectUri,
      hostname,
    })
    const { Client } = new Issuer({
      issuer: `${hostname}/`,
      authorization_endpoint: `${hostname}/authorize`,
      token_endpoint: `${hostname}/token`,
      userinfo_endpoint: `${hostname}/userinfo`,
      jwks_uri: `${hostname}/jwks`,
    })

    const any_this = this as any

    any_this.sgID = new Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      id_token_signed_response_alg: SGID_SIGNING_ALG,
      response_types: SGID_SUPPORTED_GRANT_TYPES,
      token_endpoint_auth_method: SGID_AUTH_METHOD,
    })
  }

  /**
   * To clear the cached JWKs by reinstantiating the client
   */
  reset() {
    const { Client } = new Issuer({
      issuer: `${hostname}/`,
      authorization_endpoint: `${hostname}/authorize`,
      token_endpoint: `${hostname}/token`,
      userinfo_endpoint: `${hostname}/userinfo`,
      jwks_uri: `${hostname}/jwks`,
    })

    const any_this = this as any

    any_this.sgID = new Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      id_token_signed_response_alg: SGID_SIGNING_ALG,
      response_types: SGID_SUPPORTED_GRANT_TYPES,
      token_endpoint_auth_method: SGID_AUTH_METHOD,
    })
  }
}

const sgidClient = new ConformanceSgidClient()

export { sgidClient }

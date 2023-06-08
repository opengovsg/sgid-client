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
const hostname =
  'https://www.certification.openid.net/test/a/sgid-sdk-test-rayner-2'
const redirectUri = 'http://localhost:3000/api/callback'

class ConformanceSgidClient extends SgidClient {
  constructor() {
    super({
      clientId,
      clientSecret,
      privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIEowIBAAKCAQBnPRbP6o/PauID0uDlPQmHIm7tislCnsKHdszHsrE5zYg2l5Hf
      xPCgj9F9gXVh6n6PArZK47WZ9lIREPjq6h61GTnFHbWiqCGH88TDoKphFDwxrvgX
      JEC/haNYWlR5zh60LMopSc4XGxWgqhrWnJGaky9muMSMy9ENlz+aHt8RpKGhGu3s
      bGnfDkiINp0s34I8ZxKavxGWXIjxNdEa/IUth7JunzvmmHB39DO+9wtC++d24lJ3
      Sl2eVrYLbXg1YHwJbybTTlxliLay58Jtn1erV1dwxkNgxqIZVcDCadLTu+fTyWUT
      zDD/dd7nhJSObZaHyJ16L3/3TMy+f0R8PvEVAgMBAAECggEAKL9g4KGZL2nlWVMD
      dxd3SkIZ/GH5+/SDnUoTm4J5FvJ7n+iFKAgoXYdGTT4qoYIXf8S3RKnJxMIHNDs5
      tCbCBgK13YpTZabszSc282vXs8dz1rxTqXaio7VQeo/0pbroPX8sL820rUQAblCV
      lT1o7tTHMckdsuDDW5TmAqPKscCBpPaNTtdCsZkloDQlI2Ljk42tlJh2h955zsQb
      uONnU82jf4rcAvyqNYHeNjR87cpby/Dk1NF+jKZKCs3ehqmQ3QSDNWXEL0M/3Ck2
      qBMdZryIIWpetGvPaXUOD4Yr2ZSjNlDY1XeKd8UymwZuhcvGMrp0zo3JwoWHBHLR
      ZyD+IQKBgQDC3g9ATE5/ZNDAKwpBmwvkxsNo0X94fuu+XMD17pOXjJP4NXMYp9CZ
      sdb7NXHo5Q5eUqd/3HEnAjXlQRZ/EqbBfltrtOa9/RpDOoREB/wCIA7pFhINllKb
      MPrwdzpY5sDFw9zNaxWLdM7dDeMdK8wEays+SwEy6PHdeGNpMNF4SQKBgQCHoEGp
      l/TPLv8pM/SYidbzXnz8O8YGVDTtzNbZZuiTI/I4WyJ2ib31xNYxxuchfkSIUS8b
      baB7OQsQxatZkIoM+kiRTkaWZClhVdaYV/Fx2a+WJlhTxS7cK7Kc3UJ26N520ZVz
      JY7A3RDwSoDNMrAtryZeHYdtpKKNZRtuujzqbQKBgQCi03v45QneZvYK7KvIP+7D
      PdZAOnWB0MPZL5XIqY5H3p4xky/WFTs3gaM6CuFgkizcYcI2E5O03aL9KdLLYWFX
      Yuau69y2Ocv9CuNEGUvY1sK+vsNc+ROTO20jCu0FJeNEHLHeLzE0cuj7SsRQNq1l
      r8rVZUTeLkkTHqoqVjFhiQKBgHOOcMPuK/DnKxLRKMNbFmEvjbBfwX6c+qfuktST
      IPBVfUjVJYz4GXkw6AtrXH0mF4BKI6fsBQNYe/wjX7alN2qNSY08s1nqJ3O+bmRI
      8fg+MKPvMezWIfIH7VxIDRxBl2KHeh2sz2+2K3uBDzNGz+Nsy3T/Feeuka2FixUR
      61sVAoGBALu/5harfZCowTrZxeG1hKtKoNBuWgygX+Rf7isbHRuDcOOQjXIHbkE7
      56zvLHyLbcHNEa04Om0wt/HwYaRH46Lch1m6Tqrzp9ENwcEHV2//lSkiYOdi6bDX
      eFi03yt7Q9xCtvdoOc/jpuApr9X6jBAYuVIIGfUMQ5fr3TjBXYHA
      -----END RSA PRIVATE KEY-----`,
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

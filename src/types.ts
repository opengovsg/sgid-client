export type ConstructorParams = {
  clientId: string
  clientSecret: string
  privateKey: string
  redirectUris?: string[]
  hostname?: string
}

export type AuthorizationUrlParams = {
  state: string
  scope?: string | string[]
  nonce?: string | null
  redirectUri?: string
  codeChallenge: string
}

export type AuthorizationUrlReturn = { url: string; nonce?: string }

export type CallbackParams = {
  code: string
  nonce?: string | null
  redirectUri?: string
  codeVerifier?: string
}

export type ParsedSgidDataValue = string | unknown[] | Record<string, unknown>

export type AuthorizationUrlParams = {
  state?: string
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
  codeVerifier: string
}

export type CallbackReturn = { sub: string; accessToken: string }

export type UserInfoParams = {
  sub: string
  accessToken: string
}

export type UserInfoReturn = {
  sub: string
  data: Record<string, string>
}

export type SgidClientParams = {
  clientId: string
  clientSecret: string
  privateKey: string
  redirectUri?: string
  hostname?: string
  rulesEngineEndpoint?: string
}

export type RulesParams = {
  accessToken: string
  ruleIds: string
  userInfoData: Record<string, string>
}

export type RulesReturn = {
  ruleId: string
  input: string
  output: string
}[]

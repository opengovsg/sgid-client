import { ClientAuthMethod, ResponseType } from 'openid-client'

export const SGID_SIGNING_ALG = 'RS256'
export const DEFAULT_SGID_CODE_CHALLENGE_METHOD = 'S256'
export const DEFAULT_SCOPE = 'myinfo.name openid'
export const SGID_SUPPORTED_GRANT_TYPES: ResponseType[] = ['code']
export const SGID_AUTH_METHOD: ClientAuthMethod = 'client_secret_post'

export const API_VERSION = 2

// TODO: Replace with https://rules.id.gov.sg/api/rule/eval once it's up
export const SGID_RULES_ENGINE_URL = 'http://localhost:3001/api/rule/eval'

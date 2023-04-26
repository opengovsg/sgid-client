import { ClientAuthMethod, ResponseType } from 'openid-client'

/**
 * sgID Defaults
 */
export const SGID_SIGNING_ALG = 'RS256'
export const DEFAULT_SCOPE = 'myinfo.nric_number openid'
export const SGID_SUPPORTED_FLOWS: ResponseType[] = ['code']
export const SGID_AUTH_METHOD: ClientAuthMethod = 'client_secret_post'

/**
 * PKCE Defaults
 */
export const DEFAULT_SGID_CODE_CHALLENGE_METHOD = 'S256'

/**
 * API Versioning
 */
export const API_VERSION = 2

/**
 * Testing
 */
/**
 * Regex pattern that the code verifier and code challenge in the PKCE flow should match according to the PKCE RFC
 * https://www.rfc-editor.org/rfc/rfc7636
 */
export const codeVerifierAndChallengePattern = /^[A-Za-z\d\-._~]{43,128}$/

export const DEFAULT_RESPONSE_TYPE = 'code'

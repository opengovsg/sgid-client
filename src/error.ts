// authorization URL error, also used in callback
export const MISSING_REDIRECT_URI_ERROR =
  'No redirect URI registered with this client. You must either specify a valid redirect URI in the SgidClient constructor, or pass it to the authorizationUrl and callback functions.'

// callback errors
export const NO_SUB_ERROR = 'Authorization server did not return the sub claim'
export const NO_ACCESS_TOKEN_ERROR =
  'Authorization server did not return an access token'

// userinfo errors
export const PRIVATE_KEY_IMPORT_ERROR =
  'Failed to import private key. Check that privateKey is a valid PKCS1 or PKCS8 key.'
export const DECRYPT_BLOCK_KEY_ERROR =
  'Unable to decrypt or import payload key. Check that you used the correct private key.'
export const DECRYPT_PAYLOAD_ERROR = 'Unable to decrypt payload'

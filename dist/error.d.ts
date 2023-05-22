export declare const CODE_VERIFIER_LENGTH_ERROR = "Code verifier should have a minimum length of 43 and a maximum length of 128";
export declare const PKCE_PAIR_LENGTH_ERROR = "generatePkcePair should receive a minimum length of 43 and a maximum length of 128";
export declare const MISSING_REDIRECT_URI_ERROR = "No redirect URI registered with this client. You must either specify a valid redirect URI in the SgidClient constructor, or pass it to the authorizationUrl and callback functions.";
export declare const NO_SUB_ERROR = "Authorization server did not return the sub claim";
export declare const NO_ACCESS_TOKEN_ERROR = "Authorization server did not return an access token";
export declare const PRIVATE_KEY_IMPORT_ERROR = "Failed to import private key. Check that privateKey is a valid PKCS1 or PKCS8 key.";
export declare const DECRYPT_BLOCK_KEY_ERROR = "Unable to decrypt or import payload key. Check that you used the correct private key.";
export declare const DECRYPT_PAYLOAD_ERROR = "Unable to decrypt payload";
export declare const SUB_MISMATCH_ERROR = "Sub returned by sgID did not match the sub passed to the userinfo method. Check that you passed the correct sub to the userinfo method.";

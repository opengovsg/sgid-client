"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECRYPT_PAYLOAD_ERROR = exports.DECRYPT_BLOCK_KEY_ERROR = exports.PRIVATE_KEY_IMPORT_ERROR = exports.NO_ACCESS_TOKEN_ERROR = exports.NO_SUB_ERROR = exports.MISSING_REDIRECT_URI_ERROR = void 0;
// authorization URL error, also used in callback
exports.MISSING_REDIRECT_URI_ERROR = 'No redirect URI registered with this client. You must either specify a valid redirect URI in the SgidClient constructor, or pass it to the authorizationUrl and callback functions.';
// callback errors
exports.NO_SUB_ERROR = 'Authorization server did not return the sub claim';
exports.NO_ACCESS_TOKEN_ERROR = 'Authorization server did not return an access token';
// userinfo errors
exports.PRIVATE_KEY_IMPORT_ERROR = 'Failed to import private key. Check that privateKey is a valid PKCS1 or PKCS8 key.';
exports.DECRYPT_BLOCK_KEY_ERROR = 'Unable to decrypt or import payload key. Check that you used the correct private key.';
exports.DECRYPT_PAYLOAD_ERROR = 'Unable to decrypt payload';

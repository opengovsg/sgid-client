"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SgidClient = void 0;
var jose_1 = require("jose");
var openid_client_1 = require("openid-client");
var constants_1 = require("./constants");
var Errors = __importStar(require("./error"));
var util_1 = require("./util");
var SgidClient = /** @class */ (function () {
    /**
     * Initialises an SgidClient instance.
     * @param params Constructor arguments
     * @param params.clientId Client ID provided during client registration
     * @param params.clientSecret Client secret provided during client registration
     * @param params.privateKey Client private key provided during client registration
     * @param params.redirectUri Redirection URI for user to return to your application
     * after login. If not provided in the constructor, this must be provided to the
     * authorizationUrl and callback functions.
     * @param params.hostname Hostname of OpenID provider (sgID). Defaults to
     * https://api.id.gov.sg.
     */
    function SgidClient(_a) {
        var clientId = _a.clientId, clientSecret = _a.clientSecret, privateKey = _a.privateKey, redirectUri = _a.redirectUri, _b = _a.hostname, hostname = _b === void 0 ? 'https://www.certification.openid.net/test/a/sgid-rayner' : _b;
        /**
         * Note that issuer is appended with version number only from v2 onwards
         */
        var issuer = hostname;
        var Client = new openid_client_1.Issuer({
            issuer: issuer,
            authorization_endpoint: "".concat(issuer, "/authorize"),
            token_endpoint: "".concat(issuer, "/token"),
            userinfo_endpoint: "".concat(issuer, "/userinfo"),
            jwks_uri: "".concat(issuer, "/.well-known/jwks.json"),
        }).Client;
        this.sgID = new Client({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uris: redirectUri ? [redirectUri] : undefined,
            id_token_signed_response_alg: constants_1.SGID_SIGNING_ALG,
            response_types: constants_1.SGID_SUPPORTED_GRANT_TYPES,
            token_endpoint_auth_method: constants_1.SGID_AUTH_METHOD,
        });
        /**
         * For backward compatibility with pkcs1
         */
        if (privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')) {
            this.privateKey = (0, util_1.convertPkcs1ToPkcs8)(privateKey);
        }
        else {
            this.privateKey = privateKey;
        }
        /**
         * To rectify instances where an extra '\' escape character is added to the newline
         */
        this.privateKey = this.privateKey.replace(/\\n/gm, '\n');
    }
    /**
     * Generates authorization url to redirect end-user to sgID login page.
     * @param state A string which will be passed back to your application once
     * the end-user logs in. You can also use this to track per-request state.
     * @param scope Array or space-separated scopes. 'openid' must be provided as a
     * scope. Defaults to 'myinfo.name openid'.
     * @param nonce Unique nonce for this request. If this param is undefined, a nonce
     * is generated and returned. To prevent this behaviour, specify null for this param.
     * @param redirectUri The redirect URI used in the authorization request. If this
     * param is provided, it will be used instead of the redirect URI provided in the
     * SgidClient constructor. If not provided in the constructor, the redirect URI
     * must be provided here.
     * @param codeChallenge The code challenge from the code verifier used for PKCE enhancement
     */
    SgidClient.prototype.authorizationUrl = function (_a) {
        var state = _a.state, _b = _a.scope, scope = _b === void 0 ? constants_1.DEFAULT_SCOPE : _b, _c = _a.nonce, nonce = _c === void 0 ? openid_client_1.generators.nonce() : _c, _d = _a.redirectUri, redirectUri = _d === void 0 ? this.getFirstRedirectUri() : _d, codeChallenge = _a.codeChallenge;
        var url = this.sgID.authorizationUrl({
            scope: typeof scope === 'string' ? scope : scope.join(' '),
            nonce: nonce !== null && nonce !== void 0 ? nonce : undefined,
            state: state,
            redirect_uri: redirectUri,
            code_challenge: codeChallenge,
            code_challenge_method: constants_1.DEFAULT_SGID_CODE_CHALLENGE_METHOD,
        });
        var result = { url: url };
        if (nonce) {
            result.nonce = nonce;
        }
        return result;
    };
    SgidClient.prototype.getFirstRedirectUri = function () {
        if (!this.sgID.metadata.redirect_uris ||
            this.sgID.metadata.redirect_uris.length === 0) {
            throw new Error(Errors.MISSING_REDIRECT_URI_ERROR);
        }
        return this.sgID.metadata.redirect_uris[0];
    };
    /**
     * Exchanges authorization code for access token.
     * @param code The authorization code received from the authorization server
     * @param nonce Nonce passed to authorizationUrl for this request. Specify null
     * if no nonce was passed to authorizationUrl.
     * @param redirectUri The redirect URI used in the authorization request. Defaults to the one
     * passed to the SgidClient constructor.
     * @param codeVerifier The code verifier that was used to generate the code challenge that was passed in `authorizationUrl`
     * @returns The sub (subject identifier claim) of the user and access token. The subject
     * identifier claim is the end-user's unique ID.
     */
    SgidClient.prototype.callback = function (_a) {
        var code = _a.code, _b = _a.nonce, nonce = _b === void 0 ? null : _b, _c = _a.redirectUri, redirectUri = _c === void 0 ? this.getFirstRedirectUri() : _c, codeVerifier = _a.codeVerifier;
        return __awaiter(this, void 0, void 0, function () {
            var tokenSet, sub, accessToken;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.sgID.callback(redirectUri, { code: code }, { nonce: nonce !== null && nonce !== void 0 ? nonce : undefined, code_verifier: codeVerifier })];
                    case 1:
                        tokenSet = _d.sent();
                        sub = tokenSet.claims().sub;
                        accessToken = tokenSet.access_token;
                        if (!sub) {
                            throw new Error(Errors.NO_SUB_ERROR);
                        }
                        if (!accessToken) {
                            throw new Error(Errors.NO_ACCESS_TOKEN_ERROR);
                        }
                        return [2 /*return*/, { sub: sub, accessToken: accessToken }];
                }
            });
        });
    };
    /**
     * Retrieves verified user info and decrypts it with your private key.
     * @param sub The sub returned from the callback function
     * @param accessToken The access token returned from the callback function
     * @returns The sub of the end-user and the end-user's verified data. The sub
     * returned is the same as the one passed in the params.
     */
    SgidClient.prototype.userinfo = function (_a) {
        var sub = _a.sub, accessToken = _a.accessToken;
        return __awaiter(this, void 0, void 0, function () {
            var _b, subReturned, encryptedPayloadKey, data, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sgID.userinfo(accessToken)];
                    case 1:
                        _b = _c.sent(), subReturned = _b.sub, encryptedPayloadKey = _b.key, data = _b.data;
                        if (sub !== subReturned) {
                            throw new Error(Errors.SUB_MISMATCH_ERROR);
                        }
                        if (!(encryptedPayloadKey && data)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.decryptPayload(encryptedPayloadKey, data)];
                    case 2:
                        result = _c.sent();
                        return [2 /*return*/, { sub: sub, data: result }];
                    case 3: 
                    /**
                     * When the scope requested is just `openid`, the `key` and `data` attributes are undefined
                     * because no data fields are requested. In this case, data is just an empty object.
                     */
                    return [2 /*return*/, { sub: sub, data: {} }];
                }
            });
        });
    };
    SgidClient.prototype.decryptPayload = function (encryptedPayloadKey, data) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKeyJwk, payloadJwk, e_1, decoder, decryptedKey, _a, _b, e_2, result, _c, _d, _e, _i, field, jwe, decryptedValue, _f, _g, e_3;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, jose_1.importPKCS8)(this.privateKey, 'RSA-OAEP-256')];
                    case 1:
                        // Import client private key in PKCS8 format
                        privateKeyJwk = _h.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _h.sent();
                        throw new Error(Errors.PRIVATE_KEY_IMPORT_ERROR);
                    case 3:
                        decoder = new TextDecoder();
                        _h.label = 4;
                    case 4:
                        _h.trys.push([4, 7, , 8]);
                        _b = (_a = decoder).decode;
                        return [4 /*yield*/, (0, jose_1.compactDecrypt)(encryptedPayloadKey, privateKeyJwk)];
                    case 5:
                        decryptedKey = _b.apply(_a, [(_h.sent()).plaintext]);
                        return [4 /*yield*/, (0, jose_1.importJWK)(JSON.parse(decryptedKey))];
                    case 6:
                        payloadJwk = _h.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _h.sent();
                        throw new Error(Errors.DECRYPT_BLOCK_KEY_ERROR);
                    case 8:
                        result = {};
                        _h.label = 9;
                    case 9:
                        _h.trys.push([9, 14, , 15]);
                        _c = data;
                        _d = [];
                        for (_e in _c)
                            _d.push(_e);
                        _i = 0;
                        _h.label = 10;
                    case 10:
                        if (!(_i < _d.length)) return [3 /*break*/, 13];
                        _e = _d[_i];
                        if (!(_e in _c)) return [3 /*break*/, 12];
                        field = _e;
                        jwe = data[field];
                        _g = (_f = decoder).decode;
                        return [4 /*yield*/, (0, jose_1.compactDecrypt)(jwe, payloadJwk)];
                    case 11:
                        decryptedValue = _g.apply(_f, [(_h.sent()).plaintext]);
                        result[field] = decryptedValue;
                        _h.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        e_3 = _h.sent();
                        throw new Error(Errors.DECRYPT_PAYLOAD_ERROR);
                    case 15: return [2 /*return*/, result];
                }
            });
        });
    };
    return SgidClient;
}());
exports.SgidClient = SgidClient;

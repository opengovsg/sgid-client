"use strict";
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
var util_1 = require("./util");
var SGID_SIGNING_ALG = 'RS256';
var SGID_SUPPORTED_FLOWS = ['code'];
var SGID_AUTH_METHOD = 'client_secret_post';
var SgidClient = /** @class */ (function () {
    function SgidClient(_a) {
        var clientId = _a.clientId, clientSecret = _a.clientSecret, privateKey = _a.privateKey, redirectUri = _a.redirectUri, _b = _a.hostname, hostname = _b === void 0 ? 'https://api.id.gov.sg' : _b, _c = _a.apiVersion, apiVersion = _c === void 0 ? 1 : _c;
        // TODO: Discover sgID issuer metadata via .well-known endpoint
        var Client = new openid_client_1.Issuer({
            issuer: new URL(hostname).origin,
            authorization_endpoint: "".concat(hostname, "/v").concat(apiVersion, "/oauth/authorize"),
            token_endpoint: "".concat(hostname, "/v").concat(apiVersion, "/oauth/token"),
            userinfo_endpoint: "".concat(hostname, "/v").concat(apiVersion, "/oauth/userinfo"),
            jwks_uri: "".concat(new URL(hostname).origin, "/.well-known/jwks.json"),
        }).Client;
        this.sgID = new Client({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uris: redirectUri ? [redirectUri] : undefined,
            id_token_signed_response_alg: SGID_SIGNING_ALG,
            response_types: SGID_SUPPORTED_FLOWS,
            token_endpoint_auth_method: SGID_AUTH_METHOD,
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
    }
    /**
     * Generates authorization url for sgID OIDC flow
     * @param state A random string to prevent CSRF
     * @param scopes Array or space-separated scopes, must include openid
     * @param nonce Specify null if no nonce
     * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
     * @returns
     */
    SgidClient.prototype.authorizationUrl = function (state, scope, nonce, redirectUri) {
        if (scope === void 0) { scope = 'myinfo.nric_number openid'; }
        if (nonce === void 0) { nonce = openid_client_1.generators.nonce(); }
        if (redirectUri === void 0) { redirectUri = this.getFirstRedirectUri(); }
        var url = this.sgID.authorizationUrl({
            scope: typeof scope === 'string' ? scope : scope.join(' '),
            nonce: nonce !== null && nonce !== void 0 ? nonce : undefined,
            state: state,
            redirect_uri: redirectUri,
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
            // eslint-disable-next-line typesafe/no-throw-sync-func
            throw new Error('No redirect URI registered with this client');
        }
        return this.sgID.metadata.redirect_uris[0];
    };
    /**
     * Callback handler for sgID OIDC flow
     * @param code The authorization code received from the authorization server
     * @param nonce Specify null if no nonce
     * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
     * @returns The sub of the user and access token
     */
    SgidClient.prototype.callback = function (code, nonce, redirectUri) {
        if (nonce === void 0) { nonce = null; }
        if (redirectUri === void 0) { redirectUri = this.getFirstRedirectUri(); }
        return __awaiter(this, void 0, void 0, function () {
            var tokenSet, sub, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sgID.callback(redirectUri, { code: code }, { nonce: nonce !== null && nonce !== void 0 ? nonce : undefined })];
                    case 1:
                        tokenSet = _a.sent();
                        sub = tokenSet.claims().sub;
                        accessToken = tokenSet.access_token;
                        if (!sub || !accessToken) {
                            throw new Error('Missing sub claim or access token');
                        }
                        return [2 /*return*/, { sub: sub, accessToken: accessToken }];
                }
            });
        });
    };
    /**
     * Retrieve verified user info and decrypt with client's private key
     * @param accessToken The access token returned in the callback function
     * @returns The sub of the user and data
     */
    SgidClient.prototype.userinfo = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sub, encryptedPayloadKey, data, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.sgID.userinfo(accessToken)];
                    case 1:
                        _a = _b.sent(), sub = _a.sub, encryptedPayloadKey = _a.key, data = _a.data;
                        if (!(encryptedPayloadKey && data)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.decryptPayload(encryptedPayloadKey, data)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, { sub: sub, data: result }];
                    case 3: return [2 /*return*/, { sub: sub, data: {} }];
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
                        throw new Error('Failed to import private key');
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
                        throw new Error('Unable to decrypt or import payload key');
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
                        throw new Error('Unable to decrypt payload');
                    case 15: return [2 /*return*/, result];
                }
            });
        });
    };
    return SgidClient;
}());
exports.SgidClient = SgidClient;
exports.default = SgidClient;

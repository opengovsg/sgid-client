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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeChallenge = exports.generateCodeVerifier = exports.generatePkcePair = void 0;
var openid_client_1 = require("openid-client");
var Errors = __importStar(require("./error"));
/**
 * Generates a PKCE challenge pair where `codeChallenge` is the generated S256 challenge from `codeVerifier`
 * @param length The length of the code verifier
 * @returns The generated challenge pair
 */
function generatePkcePair(length) {
    if (length === void 0) { length = 43; }
    if (length < 43 || length > 128) {
        throw new Error(Errors.PKCE_PAIR_LENGTH_ERROR);
    }
    var codeVerifier = generateCodeVerifier(length);
    var codeChallenge = generateCodeChallenge(codeVerifier);
    return { codeVerifier: codeVerifier, codeChallenge: codeChallenge };
}
exports.generatePkcePair = generatePkcePair;
/**
 * Generates the code verifier (random bytes encoded in url safe base 64) to be used in the OAuth 2.0 PKCE flow
 * @param length The length of the code verifier to generate (Defaults to 43 if not provided)
 * @returns The generated code verifier
 */
function generateCodeVerifier(length) {
    if (length === void 0) { length = 43; }
    if (length < 43 || length > 128) {
        throw new Error(Errors.CODE_VERIFIER_LENGTH_ERROR);
    }
    // 96 bytes results in a 128 long base64 string
    var codeVerifier = openid_client_1.generators.codeVerifier(96);
    // This works because a prefix of a random string is still random
    return codeVerifier.slice(0, length);
}
exports.generateCodeVerifier = generateCodeVerifier;
/**
 * Calculates the S256 PKCE code challenge for a provided code verifier
 * @param codeVerifier The code verifier to calculate the S256 code challenge for
 * @returns The calculated code challenge
 */
function generateCodeChallenge(codeVerifier) {
    return openid_client_1.generators.codeChallenge(codeVerifier);
}
exports.generateCodeChallenge = generateCodeChallenge;

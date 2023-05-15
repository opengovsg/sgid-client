"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPkcs1ToPkcs8 = void 0;
var node_rsa_1 = __importDefault(require("node-rsa"));
/**
 * Convert PKCS1 PEM private key to PKCS8 PEM
 */
function convertPkcs1ToPkcs8(pkcs1) {
    var key = new node_rsa_1.default(pkcs1, 'pkcs1');
    return key.exportKey('pkcs8');
}
exports.convertPkcs1ToPkcs8 = convertPkcs1ToPkcs8;

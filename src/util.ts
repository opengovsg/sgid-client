import NodeRSA from 'node-rsa'

import { ParsedSgidDataValue } from './types'

/**
 * Convert PKCS1 PEM private key to PKCS8 PEM
 */
export function convertPkcs1ToPkcs8(pkcs1: string): string {
  const key = new NodeRSA(pkcs1, 'pkcs1')
  return key.exportKey('pkcs8')
}

export function isStringifiedArrayOrObject(
  possibleArrayOrObjectString: string,
): boolean {
  return (
    (possibleArrayOrObjectString.charAt(0) === '[' &&
      possibleArrayOrObjectString.charAt(
        possibleArrayOrObjectString.length - 1,
      ) === ']') ||
    (possibleArrayOrObjectString.charAt(0) === '{' &&
      possibleArrayOrObjectString.charAt(
        possibleArrayOrObjectString.length - 1,
      ) === '}')
  )
}

export function safeJsonParse(jsonString: string): ParsedSgidDataValue {
  try {
    return JSON.parse(jsonString)
  } catch (_) {
    return jsonString
  }
}

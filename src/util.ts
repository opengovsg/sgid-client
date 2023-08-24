import NodeRSA from 'node-rsa'

import { ParsedSgidDataValue } from './types'

/**
 * Convert PKCS1 PEM private key to PKCS8 PEM
 */
export function convertPkcs1ToPkcs8(pkcs1: string): string {
  const key = new NodeRSA(pkcs1, 'pkcs1')
  return key.exportKey('pkcs8')
}

export function isStringWrappedInSquareBrackets(
  possibleArrayString: string,
): boolean {
  return (
    possibleArrayString.charAt(0) === '[' &&
    possibleArrayString.charAt(possibleArrayString.length - 1) === ']'
  )
}

export function safeJsonParse(jsonString: string): ParsedSgidDataValue {
  try {
    return JSON.parse(jsonString)
  } catch (_) {
    return jsonString
  }
}

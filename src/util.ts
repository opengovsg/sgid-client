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

export function isNonEmptyString(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (value === '') return false
  return true
}

export function safeJsonParse(jsonString: string): ParsedSgidDataValue {
  try {
    return JSON.parse(jsonString)
  } catch (_) {
    return jsonString
  }
}

function isDefinedObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    value !== undefined &&
    !Array.isArray(value)
  )
}

export function isSgidUserinfoObject(
  data: unknown,
): data is Record<string, string> {
  if (!isDefinedObject(data)) {
    return false
  }

  // Note that we don't need to check for the key being a string, because
  // in Javascript all object keys are coerced into strings when you attempt
  // to access them
  return Object.values(data).every((value) => typeof value === 'string')
}

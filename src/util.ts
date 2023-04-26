import { compactDecrypt, importJWK, importPKCS8 } from 'jose'
import NodeRSA from 'node-rsa'

/**
 * Convert PKCS1 PEM private key to PKCS8 PEM
 */
export function convertPkcs1ToPkcs8(pkcs1: string): string {
  const key = new NodeRSA(pkcs1, 'pkcs1')
  return key.exportKey('pkcs8')
}

/**
 * Decrypts the payload received from the `userinfo` function
 * @param privateKey sgID client private key to decrypt the encrypted payload key
 * @param encryptedPayloadKey Encrypted payload key that when decrypted, is used to decrypt the encrypted data
 * @param data Encrypted data
 * @returns Decrypted data and unique sgID
 */
export async function decryptPayload(
  privateKey: string,
  encryptedPayloadKey: string,
  data: Record<string, string>,
): Promise<Record<string, string>> {
  let privateKeyJwk
  let payloadJwk
  try {
    // Import client private key in PKCS8 format
    privateKeyJwk = await importPKCS8(privateKey, 'RSA-OAEP-256')
  } catch (e) {
    throw new Error('Failed to import private key')
  }

  // Decrypt key to get plaintext symmetric key
  const decoder = new TextDecoder()
  try {
    const decryptedKey = decoder.decode(
      (await compactDecrypt(encryptedPayloadKey, privateKeyJwk)).plaintext,
    )
    payloadJwk = await importJWK(JSON.parse(decryptedKey))
  } catch (e) {
    throw new Error('Unable to decrypt or import payload key')
  }

  // Decrypt each jwe in body
  const result: Record<string, string> = {}
  try {
    for (const field in data) {
      const jwe = data[field]
      const decryptedValue = decoder.decode(
        (await compactDecrypt(jwe, payloadJwk)).plaintext,
      )
      result[field] = decryptedValue
    }
  } catch (e) {
    throw new Error('Unable to decrypt payload')
  }
  return result
}

import {
  generateCodeChallenge,
  generateCodeVerifier,
  generatePkcePair,
} from '../src'
import { codeVerifierAndChallengePattern } from '../src/constants'

import { MOCK_CODE_VERIFIER } from './mocks/constants'

describe('generators', () => {
  describe('generatePkcePair', () => {
    it('can generate a PKCE pair', () => {
      const pkcePair = generatePkcePair()
      expect(pkcePair).toBeDefined()
    })
  })

  describe('generateCodeVerifier', () => {
    it('should generate a code verifier of length 43 when no length is provided', () => {
      const codeVerifier = generateCodeVerifier()

      expect(codeVerifier.length).toBe(43)
      expect(codeVerifier).toMatch(codeVerifierAndChallengePattern)
    })

    it('should generate a code verifier of specified length when length between 43 (inclusive) and 128 (inclusive) is provided', () => {
      for (let length = 43; length <= 128; length++) {
        const codeVerifier = generateCodeVerifier(length)
        expect(codeVerifier.length).toBe(length)
        expect(codeVerifier).toMatch(codeVerifierAndChallengePattern)
      }
    })

    it('should throw an error when a length < 43 or length > 128 is provided', () => {
      for (const length of [-1, 0, 42, 129, 138, 999]) {
        expect(() => generateCodeVerifier(length)).toThrowError(
          `The code verifier should have a minimum length of 43 and a maximum length of 128. Length of ${length} was provided`,
        )
      }
    })
  })

  describe('generateCodeChallenge', () => {
    it('should match the specified pattern', () => {
      expect(generateCodeChallenge(MOCK_CODE_VERIFIER)).toMatch(
        codeVerifierAndChallengePattern,
      )
    })

    it('should be deterministic (return the same code challenge given the same code verifier)', () => {
      const firstCodeChallenge = generateCodeChallenge(MOCK_CODE_VERIFIER)
      const secondCodeChallenge = generateCodeChallenge(MOCK_CODE_VERIFIER)

      expect(firstCodeChallenge).toBe(secondCodeChallenge)
    })
  })
})

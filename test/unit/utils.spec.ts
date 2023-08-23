import { isStringWrappedInSquareBrackets, safeJsonParse } from '../../src/util'

describe('util functions', () => {
  const exampleArray = ['a', 'b', 'c']
  const exampleStringifiedArray = JSON.stringify(exampleArray)
  const corruptedStringifiedArray = '["a", ]]]]'
  const exampleObject = { a: 'b' }
  const exampleStringifiedObject = JSON.stringify(exampleObject)
  const exampleString = 'hello world'

  describe('isStringWrappedInSquareBrackets', () => {
    it('should correctly identify strings wrapped in square brackets', () => {
      expect(isStringWrappedInSquareBrackets(exampleStringifiedArray)).toBe(
        true,
      )
      expect(isStringWrappedInSquareBrackets(corruptedStringifiedArray)).toBe(
        true,
      )
    })
    it('should correctly reject strings that are not stringified arrays', () => {
      expect(isStringWrappedInSquareBrackets(exampleStringifiedObject)).toBe(
        false,
      )
      expect(isStringWrappedInSquareBrackets(exampleString)).toBe(false)
    })
  })

  describe('safeJsonParse', () => {
    it('should correctly parse valid JSON strings', () => {
      expect(JSON.stringify(safeJsonParse(exampleStringifiedArray))).toBe(
        JSON.stringify(exampleArray),
      )
      expect(JSON.stringify(safeJsonParse(exampleStringifiedObject))).toBe(
        JSON.stringify(exampleObject),
      )
    })
    it('should return the original string if the input string is not a valid JSON string', () => {
      expect(safeJsonParse(corruptedStringifiedArray)).toBe(
        corruptedStringifiedArray,
      )
      expect(safeJsonParse(exampleString)).toBe(exampleString)
    })
  })
})

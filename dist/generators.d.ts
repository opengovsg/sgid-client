/**
 * Generates a PKCE challenge pair where `codeChallenge` is the generated S256 challenge from `codeVerifier`
 * @param length The length of the code verifier
 * @returns The generated challenge pair
 */
export declare function generatePkcePair(length?: number): {
    codeVerifier: string;
    codeChallenge: string;
};
/**
 * Generates the code verifier (random bytes encoded in url safe base 64) to be used in the OAuth 2.0 PKCE flow
 * @param length The length of the code verifier to generate (Defaults to 43 if not provided)
 * @returns The generated code verifier
 */
export declare function generateCodeVerifier(length?: number): string;
/**
 * Calculates the S256 PKCE code challenge for a provided code verifier
 * @param codeVerifier The code verifier to calculate the S256 code challenge for
 * @returns The calculated code challenge
 */
export declare function generateCodeChallenge(codeVerifier: string): string;

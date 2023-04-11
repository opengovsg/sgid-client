export declare class SgidClient {
    private privateKey;
    private sgID;
    constructor({ clientId, clientSecret, privateKey, redirectUri, hostname, apiVersion, }: {
        clientId: string;
        clientSecret: string;
        privateKey: string;
        redirectUri?: string;
        hostname?: string;
        apiVersion?: number;
    });
    /**
     * Generates authorization url for sgID OIDC flow
     * @param state A random string to prevent CSRF
     * @param scopes Array or space-separated scopes, must include openid
     * @param nonce Specify null if no nonce
     * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
     * @returns
     */
    authorizationUrl(state: string, scope?: string | string[], nonce?: string | null, redirectUri?: string): {
        url: string;
        nonce?: string;
    };
    private getFirstRedirectUri;
    /**
     * Callback handler for sgID OIDC flow
     * @param code The authorization code received from the authorization server
     * @param nonce Specify null if no nonce
     * @param redirectUri The redirect URI used in the authorization request, defaults to the one registered with the client
     * @returns The sub of the user and access token
     */
    callback(code: string, nonce?: string | null, redirectUri?: string): Promise<{
        sub: string;
        accessToken: string;
    }>;
    /**
     * Retrieve verified user info and decrypt with client's private key
     * @param accessToken The access token returned in the callback function
     * @returns The sub of the user and data
     */
    userinfo(accessToken: string): Promise<{
        sub: string;
        data: Record<string, string>;
    }>;
    private decryptPayload;
}
export default SgidClient;

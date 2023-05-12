import { Client } from 'openid-client';
export type SgidClientParams = {
    clientId: string;
    clientSecret: string;
    privateKey: string;
    redirectUri?: string;
    hostname: string;
    apiVersion?: number;
};
export declare class SgidClient {
    private privateKey;
    private sgID;
    /**
     * Initialises an SgidClient instance.
     * @param params Constructor arguments
     * @param params.clientId Client ID provided during client registration
     * @param params.clientSecret Client secret provided during client registration
     * @param params.privateKey Client private key provided during client registration
     * @param params.redirectUri Redirection URI for user to return to your application
     * after login. If not provided in the constructor, this must be provided to the
     * authorizationUrl and callback functions.
     * @param params.hostname Hostname of OpenID provider (sgID). Defaults to
     * https://api.id.gov.sg.
     * @param params.apiVersion sgID API version to use. Defaults to 1.
     */
    constructor({ sgID, privateKey }: {
        sgID: Client;
        privateKey: string;
    });
    static create({ clientId, clientSecret, privateKey, redirectUri, hostname, }: SgidClientParams): Promise<SgidClient>;
    /**
     * Generates authorization url to redirect end-user to sgID login page.
     * @param state A string which will be passed back to your application once the end-user
     * logs in. You should use this to prevent cross-site request forgery attacks (see
     * https://www.rfc-editor.org/rfc/rfc6749#section-10.12). You can also use this to
     * track per-request state.
     * @param scopes Array or space-separated scopes. 'openid' must be provided as a scope.
     * Defaults to 'myinfo.nric_number openid'.
     * @param nonce Unique nonce for this request. If this param is undefined, a nonce is generated
     * and returned. To prevent this behaviour, specify null for this param.
     * @param redirectUri The redirect URI used in the authorization request. Defaults to the one
     * passed to the SgidClient constructor.
     */
    authorizationUrl(state: string, scope?: string | string[], nonce?: string | null, redirectUri?: string): {
        url: string;
        nonce?: string;
    };
    private getFirstRedirectUri;
    /**
     * Exchanges authorization code for access token.
     * @param code The authorization code received from the authorization server
     * @param nonce Nonce passed to authorizationUrl for this request. Specify null
     * if no nonce was passed to authorizationUrl.
     * @param redirectUri The redirect URI used in the authorization request. Defaults to the one
     * passed to the SgidClient constructor.
     * @returns The sub (subject identifier claim) of the user and access token. The subject
     * identifier claim is the end-user's unique ID.
     */
    callback(code: string, nonce?: string | null, redirectUri?: string): Promise<{
        sub: string;
        accessToken: string;
    }>;
    /**
     * Retrieves verified user info and decrypts it with your private key.
     * @param accessToken The access token returned in the callback function
     * @returns The sub of the end-user and the end-user's verified data
     */
    userinfo(accessToken: string): Promise<{
        sub: string;
        data: Record<string, string>;
    }>;
    private decryptPayload;
}
export default SgidClient;

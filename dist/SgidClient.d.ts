import { AuthorizationUrlParams, AuthorizationUrlReturn, CallbackParams, CallbackReturn, SgidClientParams, UserInfoParams, UserInfoReturn } from './types';
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
     */
    constructor({ clientId, clientSecret, privateKey, redirectUri, hostname, }: SgidClientParams);
    /**
     * Generates authorization url to redirect end-user to sgID login page.
     * @param state A string which will be passed back to your application once
     * the end-user logs in. You can also use this to track per-request state.
     * @param scope Array or space-separated scopes. 'openid' must be provided as a
     * scope. Defaults to 'myinfo.name openid'.
     * @param nonce Unique nonce for this request. If this param is undefined, a nonce
     * is generated and returned. To prevent this behaviour, specify null for this param.
     * @param redirectUri The redirect URI used in the authorization request. If this
     * param is provided, it will be used instead of the redirect URI provided in the
     * SgidClient constructor. If not provided in the constructor, the redirect URI
     * must be provided here.
     * @param codeChallenge The code challenge from the code verifier used for PKCE enhancement
     */
    authorizationUrl({ state, scope, nonce, redirectUri, codeChallenge, }: AuthorizationUrlParams): AuthorizationUrlReturn;
    private getFirstRedirectUri;
    /**
     * Exchanges authorization code for access token.
     * @param code The authorization code received from the authorization server
     * @param nonce Nonce passed to authorizationUrl for this request. Specify null
     * if no nonce was passed to authorizationUrl.
     * @param redirectUri The redirect URI used in the authorization request. Defaults to the one
     * passed to the SgidClient constructor.
     * @param codeVerifier The code verifier that was used to generate the code challenge that was passed in `authorizationUrl`
     * @returns The sub (subject identifier claim) of the user and access token. The subject
     * identifier claim is the end-user's unique ID.
     */
    callback({ code, nonce, redirectUri, codeVerifier, }: CallbackParams): Promise<CallbackReturn>;
    /**
     * Retrieves verified user info and decrypts it with your private key.
     * @param sub The sub returned from the callback function
     * @param accessToken The access token returned from the callback function
     * @returns The sub of the end-user and the end-user's verified data. The sub
     * returned is the same as the one passed in the params.
     */
    userinfo({ sub, accessToken, }: UserInfoParams): Promise<UserInfoReturn>;
    private decryptPayload;
}

![](sgid-logo.png)

# sgid-client

[![npm version](https://badge.fury.io/js/@opengovsg%2Fsgid-client.svg)](https://badge.fury.io/js/@opengovsg%2Fsgid-client)

The official TypeScript/JavaScript client for sgID

## Installation

```bash
npm i @opengovsg/sgid-client
```

## Usage

For more detailed instructions on how to register your client and integrate with sgID, please refer to our [developer documentation](https://docs.id.gov.sg/).

### Initialization

```typescript
import { SgidClient } from '@opengovsg/sgid-client'

const client = new SgidClient({
  clientId: '<Insert your client ID>',
  clientSecret: '<Insert your client secret>',
  privateKey: '<Insert your private key as a string>',
  redirectUri: '<Insert your redirect URI>',
})
```

### Generate code challenge and verifier

This is a required step for OIDC ([more info](https://oauth.net/2/pkce/)).

- The code challenge should be provided in `authorizationUrl`.
- The codeVerifier should be stored in the user's session so it can be retrieved later for use in `callback`.
- A unique pair should be generated for each authorization request.

`generatePkcePair([length])`

- parameters: `<number>` (Optional) Length of the codeVerifier to generate. **Default**: 43
- Returns: `<Object>`
  - codeChallenge: `<string>` **S256** code challenge generated from the code verifier
  - codeVerifier: `<string>`

Example usage:

```typescript
const { codeChallenge, codeVerifier } = generatePkcePair()
```

### Get Authorization URL

`client.authorizationUrl(parameters)`

- parameters: `<Object>`
  - codeChallenge: `<string>` Code challenge generated from `generatePkcePair`.
  - state: `<string>` (Optional) Used to track application state which will be passed back to you in query params via the redirect URI after login.
  - scope: `<string> | <string[]>` (Optional) Scopes being requested. Can be provided as a string array or a space-concatenated string. **Default**: `myinfo.name openid`
  - nonce: `<string> | <null>` (Optional) Random, unique value to associate a user-session with an ID Token and to mitigate replay attacks. Set as `null` to omit the nonce. **Default**: Randomly generates a nonce if unspecified or set as `undefined`
  - redirectUri: `<string>` (Optional) Overrides redirect URI initially provided in constructor. **Default**: Utilizes the `redirectUri` provided in the constructor.
- Returns: `<Object>`
  - url: `<string>` Generated authorization url.
  - nonce: `<string> | <undefined>` Provided nonce, randomly generated nonce, or `undefined` (based on nonce input). Should be stored in the user's session so it can be retrieved later for use in `callback`.

Example usage:

```typescript
const { url, nonce } = client.authorizationUrl({
  codeChallenge: 'zaqUHoBV3rnhBF2g0Gkz1qkpEZXHqi2OrPK1DqRi-Lk',
  state: 'state',
  scope: ['openid', 'myinfo.name'], // or 'openid myinfo.name'
  nonce: undefined,
  redirectUri: 'http://localhost:3000/callback',
})
```

### Token exchange

`async client.callback(parameters)`

- parameters: `<Object>`
  - code: `<string>` Authorization code returned in query params via the redirect URI after login.
  - codeVerifier: `<string>` Code verifier for the code challenge provided in `authorizationUrl`.
  - nonce: `<string> | <null>` (Optional) Nonce returned from `authorizationUrl` (Set as `null` if nonce was set as `null` in `authorizationUrl`).
  - redirectUri: `<string>` (Optional) Overriding redirect URI used in `authorizationUrl` (if provided).
- Returns: `<Object>`
  - sub: `<string>` Represents a unique identifer for the end-user.
  - accessToken: `<string>` Access token used to request user info.

Example usage:

```typescript
const { sub, accessToken } = await client.callback({
  code: 'code',
  codeVerifier: 'bbGcObXZC1YGBQZZtZGQH9jsyO1vypqCGqnSU_4TI5S',
  nonce: 'nonce',
  redirectUri: 'http://localhost:3000/other_callback',
})
```

### User info

`async client.userinfo(parameters)`

- parameters: `<Object>`
  - sub: `<string>` Sub obtained from `callback`.
  - accessToken: `<string>` Access token obtained from `callback`.
- Returns: `<Object>`
  - sub: `<string>`Represents a unique identifer for the end-user.
  - data: `<Object>` A JSON object containing end-user info where the keys are the scopes requested in `authorizationUrl`.

Example usage:

```typescript
const { sub, data } = await client.userinfo({
  sub: 'sub',
  accessToken: 'access_token',
})
// data: { myinfo.name: "JAMUS TAN" }
```

## Supported Runtime and Environment

This library depends on [jose](https://www.npmjs.com/package/jose) npm package which currently supports [these Node.js versions](https://github.com/panva/jose/issues/262).

## CHANGELOG

See [Releases](https://github.com/opengovsg/sgid-client/releases) for CHANGELOG and breaking changes.

![](sgid-logo.png)

# sgid-client

[![npm version](https://badge.fury.io/js/@opengovsg%2Fsgid-client.svg)](https://badge.fury.io/js/@opengovsg%2Fsgid-client)

The official TypeScript/JavaScript client for sgID

## CHANGELOG

See [Releases](https://github.com/opengovsg/sgid-client/releases) for CHANGELOG and breaking changes.

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
  clientId: 'CLIENT-ID',
  clientSecret: 'cLiEnTsEcReT',
  privateKey: '-----BEGIN PRIVATE KEY-----MII ... XXX-----END PRIVATE KEY-----',
  redirectUri: 'http://localhost:3000/callback',
})
```

### Generate PKCE pair

`generatePkcePair([length])`

```typescript
const { codeChallenge, codeVerifier } = generatePckePair()
```

### Get Authorization URL

`async client.authorizationUrl(parameters)`

- parameters: `<Object>`
  - state: `<string>`
  - scope: `<string | string[]>` **Default**: `myinfo.name openid`
  - nonce: `<string>` **Default**: Randomly generates a nonce if unspecified
  - redirectUri: `<string>` **Default**: Utilizes the `redirectUri` provided in the constructor
  - codeChallenge: `<string>`

```typescript
const { url } = client.authorizationUrl({
  state: 'state', // no longer mandatory as PKCE protects against CSRF
  scope: ['openid', 'myinfo.name'], // or space-concatenated string
  nonce: null, // defaults to randomly generated nonce if unspecified
  redirectUri: 'http://localhost:3000/callback', // optional, to override redirect uri provided in constructor
  codeChallenge: 'zaqUHoBV3rnhBF2g0Gkz1qkpEZXHqi2OrPK1DqRi-Lk', // generated from the previous step
})
```

### Token exchange

`async client.callback(parameters)`

- parameters: `<Object>`
  - code: `<string>`
  - nonce: `<string>`
  - redirectUri: `<string>`
  - codeVerifier: `<string>`

```typescript
const { sub, accessToken } = await client.callback({
  code: 'code', // auth code reuturned from redirect_url
  nonce: null,
  redirectUri: 'http://localhost:3000/other_callback', // optional, unless overridden
  codeVerifier: 'bbGcObXZC1YGBQZZtZGQH9jsyO1vypqCGqnSU_4TI5S',
})
```

### User info

`async client.userinfo(parameters)`

- parameters: `<Object>`
  - accessToken: `<string>`

```typescript
const { sub, data } = await client.userinfo({ accessToken: 'access_token' })
// data: { myinfo.name: "JAMUS TAN" }
```

## Supported Runtime and Environment

This library depends on [jose](https://www.npmjs.com/package/jose) npm package which currently supports [these Node.js versions](https://github.com/panva/jose/issues/262).

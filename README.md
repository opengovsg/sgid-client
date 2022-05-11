![](sgid-logo.png)

# sgid-client

The official TypeScript/JavaScript client for sgID

## Installation

```bash
npm i @opengovsg/sgid-client
```

## Usage

### Initialization

```typescript
import SgidClient from '@opengovsg/sgid-client'

const client = new SgidClient({
  clientId: 'CLIENT-ID',
  clientSecret: 'cLiEnTsEcReT',
  privateKey: '-----BEGIN PRIVATE KEY-----MII ... XXX-----END PRIVATE KEY-----',
  redirectUri: 'http://localhost:3000/callback',
})
```

### Get Authorization URL

`client.authorizationUrl(state, scope, [nonce], [redirectUri])`

```typescript
const { url } = client.authorizationUrl(
  'state',
  ['openid', 'myinfo.nric_number'], // or space-concatenated string
  null, // defaults to randomly generated nonce if unspecified
  'http://localhost:3000/other_callback', // overrides redirect uri
)
```

### Token exchange

`async client.callback(code, [nonce], [redirectUri])`

```typescript
const { sub, accessToken } = await client.callback(
  'code', // auth code reuturned from redirect_url
  null,
  'http://localhost:3000/other_callback', // optional, unless overridden
)
```

### User info

`async client.userinfo(accessToken)`

```typescript
const { sub, data } = await client.userinfo('access_token')
// data: { myinfo.nric_number: "S1231231A", myinfo.name: "JAMUS TAN" }
```

## Supported Runtime and Environment

This library depends on [jose](https://www.npmjs.com/package/jose) npm package which currently supports [these Node.js versions](https://github.com/panva/jose/issues/262).

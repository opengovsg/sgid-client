![](sgid-logo.png)

# sgid-client

[![npm version](https://badge.fury.io/js/@opengovsg%2Fsgid-client.svg)](https://badge.fury.io/js/@opengovsg%2Fsgid-client)

The official TypeScript/JavaScript client for sgID

## Installation

```bash
npm i @opengovsg/sgid-client
```

## Quick start

Refer to our developer documentation for one of our [framework-specific guides](https://docs.id.gov.sg/integrations-with-sgid/typescript-javascript/framework-guides), or check out the [quick start](https://docs.id.gov.sg/integrations-with-sgid/typescript-javascript#quick-start).

## API reference

Refer to the [API reference in our developer documentation](https://docs.id.gov.sg/integrations-with-sgid/typescript-javascript/api-reference).

## Local development

To develop against the SDK from one of the apps in [`examples/`](examples), link
your working copy in place of the published package.

```bash
# in this repo
npm install
npm run build
npm link

# in the example app you want to test against, e.g. examples/express
npm install
npm link @opengovsg/sgid-client
```

`package.json` points `main` at `dist/`, so the SDK must be built before the
example can resolve it. While iterating, leave a rebuild running:

```bash
npm run build:watch
```

Confirm the example is using your working copy rather than the registry version:

```bash
node -e "console.log(require.resolve('@opengovsg/sgid-client'))"
```

To undo the link and go back to the published package:

```bash
# in the example app
npm unlink --no-save @opengovsg/sgid-client && npm install

# in this repo
npm unlink
```

## Supported Runtime and Environment

This library depends on [jose](https://www.npmjs.com/package/jose) npm package which currently supports [these Node.js versions](https://github.com/panva/jose/issues/262).

## CHANGELOG

See [Releases](https://github.com/opengovsg/sgid-client/releases) for CHANGELOG and breaking changes.

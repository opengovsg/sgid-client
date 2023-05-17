# ExpressJS example sgID app

The example application code is in `index.ts`. You can copy this code to bootstrap your sgID client application, and run this app locally to understand how this SDK helps you interact with the sgID server.

## Running this example app locally

### Prerequisites

Register a new client at the [sgID developer portal](https://developer.id.gov.sg). For detailed instructions on how to register, check out our [documentation](https://jie-hao-kwa.gitbook.io/sgid-v2-beta/~/changes/75HA2ZSHqQMuHPNECzfs/introduction/getting-started/registration). Feel free to register a test client; there is no limit to the number of clients you can create.

When registering a client, be sure to register the callback URL to be `http://localhost:5001/api/callback`, since this example runs on port `5001` by default.

### Steps to run locally

1. Clone this repo.

```
git clone https://github.com/opengovsg/sgid-client.git
```

2. Go to this folder and copy the contents of `example.env` into a new file called `.env`.

```
cd sgid-client/examples/express
cat .env.example > .env
```

3. Replace the values in `.env` with the credentials of your sgID client (see [Prerequisites](#prerequisites)).

4. Run:

```
npm install
npm start
```

## For contributors

To start the server in debug mode, run:

```
npm install
npm run dev
```

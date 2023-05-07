# ExpressJS example sgID app

The example application code is in `index.ts`. You can copy this code to bootstrap your sgID client application.

## Running locally

1. Register a new client at the [sgID developer portal](https://developer.id.gov.sg). Feel free to register a test client; there is no limit to the number of clients you can create.
2. Create a new file called `.env` in this directory. Copy the contents of `.env.example` into this new file, and replace the values with the credentials of the client created in step 1.
3. Run:

```
npm install
npm start
```

## Development

To start the server in debug mode, run:

```
npm install
npm run dev
```

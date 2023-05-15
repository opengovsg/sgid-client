# sgID Next.js (SSR) Example

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before you can run the development server, you will have to register your client on the sgID [developer portal](https://developer.id.gov.sg/).

> For more information about sgID, please visit the [developer documentation](https://docs.id.gov.sg/).

Copy the `.env.example` file, rename it to `.env`, and fill in your credentials obtained during registration.

Replace the `redirectUri` in `src/lib/sgidClient.ts` with `http://localhost:3000/success`

Then, run the server by running:

```bash
npm run build && npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

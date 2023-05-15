import { SgidClient } from "@opengovsg/sgid-client";

const sgidClient = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID),
  clientSecret: String(process.env.SGID_CLIENT_SECRET),
  privateKey: String(process.env.SGID_PRIVATE_KEY).replace(/\\n/g, "\n"),
  redirectUri: "https://sgid-nextjs-ssr-demo.vercel.app/success",

  // For local development
  // redirectUri: "http://localhost:3000/success",
});

export { sgidClient };

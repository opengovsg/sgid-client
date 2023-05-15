import { SgidClient } from "@opengovsg/sgid-client";

const sgidClient = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID) || "",
  clientSecret: String(process.env.SGID_CLIENT_SECRET) || "",
  privateKey: String(process.env.SGID_PRIVATE_KEY).replace(/\\n/g, "\n") || "",
  redirectUri:
    process.env.NEXT_ENV !== "development"
      ? "https://sgid-nextjs-csr-demo.vercel.app/api/callback"
      : "http://localhost:3000/api/callback",
});

export { sgidClient };

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { store } from "../../lib/store";
import { sgidClient } from "../../lib/sgidClient";
import { setCookie } from "cookies-next";
import { generatePkcePair } from "@opengovsg/sgid-client";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let { state } = req.query;
  state = String(state);

  const sessionId = uuidv4();

  const { codeChallenge, codeVerifier } = generatePkcePair();

  const { url, nonce } = sgidClient.authorizationUrl({
    state,
    codeChallenge,
  });

  store.set(sessionId, { state, nonce, codeVerifier });

  setCookie("sessionId", sessionId, { req, res });

  res.redirect(url);
}

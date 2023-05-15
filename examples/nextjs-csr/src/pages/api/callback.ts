// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../lib/store";
import { sgidClient } from "../../lib/sgidClient";
import { getCookie, setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { code, state } = req.query;
  const sessionId = getCookie("sessionId", { req, res });

  if (typeof sessionId !== "string") {
    return res.status(400).send("Session ID not found in browser cookies");
  } else if (!code) {
    return res.status(400).send("Authorization code not found in query params");
  }
  code = String(code);

  const session = store.get(sessionId);

  if (!session) {
    return res.status(400).send("Session not found");
  } else if (state && state !== session.state) {
    return res.status(400).send("State does not match");
  } else if (
    !session.codeVerifier ||
    typeof session.codeVerifier !== "string"
  ) {
    return res.status(400).send("Code verifier not found");
  }

  const { nonce, codeVerifier } = session;

  const { accessToken } = await sgidClient.callback({
    code,
    nonce,
    codeVerifier,
  });

  const newSession = {
    ...session,
    accessToken,
  };

  store.set(sessionId, newSession);

  res.redirect("/logged-in");
}

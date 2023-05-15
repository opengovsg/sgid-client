// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../lib/store";
import { sgidClient } from "../../lib/sgidClient";
import { getCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = getCookie("sessionId", { req, res });

  if (typeof sessionId !== "string") {
    return res.status(400).send("Session ID not found in browser cookies");
  }

  const session = store.get(sessionId);

  if (!session) {
    return res.status(400).send("Session not found");
  } else if (!session.accessToken || typeof session.accessToken !== "string") {
    return res.status(400).send("Access token not in session");
  }

  const { accessToken } = session;

  const { sub, data } = await sgidClient.userinfo({ accessToken });

  const newSession = {
    ...session,
    sgid: sub,
    userInfo: data,
  };
  store.set(sessionId, newSession);

  const { accessToken: _, nonce: __, ...dataToReturn } = newSession;

  res.json(dataToReturn);
}

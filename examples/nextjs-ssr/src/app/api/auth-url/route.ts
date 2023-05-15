import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { sgidClient } from "@/lib/sgidClient";
import { v4 as uuidv4 } from "uuid";

export function GET(req: NextRequest) {
  // Generate new session ID
  const sessionId = uuidv4();

  // Retrieve state form query params
  const state = new URL(req.url).searchParams.get("state");

  // Generate authorization url
  const { url, nonce } = sgidClient.authorizationUrl(
    String(state),
    "openid myinfo.name"
  );

  // Store state in memory
  store.set(sessionId, { state: String(state), nonce });

  // Redirect to authorization url
  const res = NextResponse.redirect(url);

  // Set session ID in browser cookies
  res.cookies.set("sessionId", sessionId);

  return res;
}

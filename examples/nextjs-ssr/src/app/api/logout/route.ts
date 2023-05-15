import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export function GET(req: NextRequest) {
  // Retrieve session ID from cookies
  const sessionId = req.cookies.get("sessionId")?.value;

  // Delete session from memory
  store.delete(String(sessionId));

  // Redirect to home page
  const url = req.nextUrl.clone();
  url.pathname = "/";
  const res = NextResponse.redirect(url);

  // Set session ID in browser cookies
  res.cookies.delete("sessionId");

  return res;
}

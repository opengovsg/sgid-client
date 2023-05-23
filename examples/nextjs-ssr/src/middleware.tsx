import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  switch (req.nextUrl.pathname) {
    case '/':
      // Generate new session ID
      const sessionId = req.cookies.get('sessionId')?.value || uuidv4()

      // Set session ID in cookie
      const res = NextResponse.next()
      res.cookies.set({
        name: 'sessionId',
        value: sessionId,
        httpOnly: true,
        secure: true,
      })
      return res
    case '/logout':
      const logoutRes = NextResponse.next()
      logoutRes.cookies.delete('sessionId')
      return logoutRes
  }
}

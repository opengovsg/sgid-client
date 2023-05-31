import type { NextApiRequest, NextApiResponse } from 'next'
import { store } from '../../lib/store'
import { sgidClient } from '../../lib/sgidClient'
import { getCookie } from 'cookies-next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Retrieve the auth code from the query params
    let { code, state } = req.query
    console.log(req.cookies)
    // Retrieve the session ID from the browser cookies
    const sessionId = getCookie('sessionId', { req, res })

    if (typeof sessionId !== 'string') {
      return res
        .status(400)
        .send('Session ID not found in browser cookies (HEY)')
    } else if (!code) {
      return res
        .status(400)
        .send('Authorization code not found in query params')
    }
    code = String(code)

    // Retrieve the code verifier from the store
    const session = store.get(sessionId)

    if (!session) {
      return res.status(400).send('Session not found')
    } else if (state && state !== session.state) {
      return res.status(400).send('State does not match')
    }

    const { nonce, codeVerifier } = session

    if (!codeVerifier || typeof codeVerifier !== 'string') {
      return res.status(400).send('Code verifier not found')
    }

    // Exchange the auth code and code verifier for the access token and sub
    // (sub stands for subject which is a unique identifier for your user)
    const { accessToken, sub } = await sgidClient.callback({
      code,
      nonce,
      codeVerifier,
    })

    // Store the access token and sub
    const updatedSession = {
      ...session,
      accessToken,
      sub,
    }

    store.set(sessionId, updatedSession)

    // Redirect to a logged in page
    res.redirect('/logged-in')
  } catch (error) {
    console.error(error)
    res.redirect('/error')
  }
}

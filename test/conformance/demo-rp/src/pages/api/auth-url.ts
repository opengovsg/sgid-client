import { generatePkcePair } from '@opengovsg/sgid-client'
import { setCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

import { sgidClient } from '../../lib/sgidClient'
import { store } from '../../lib/store'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Retrieve the state from the query params
    let { state } = req.query
    state = String(state)

    // Generate a session ID
    const sessionId = uuidv4()

    // Generate a PKCE pair (consisting of code challenge and code verifier)
    const { codeChallenge, codeVerifier } = generatePkcePair()

    // Generate an authorization URL
    const { url, nonce } = sgidClient.authorizationUrl({
      state,
      codeChallenge,
    })

    // Store the code verifier, state and nonce in the store
    store.set(sessionId, { codeVerifier, state, nonce })

    // Set the session ID in the browser cookies
    setCookie('sessionId', sessionId, {
      req,
      res,
      httpOnly: true,
      // domain: 'http://localhost:3000',
      // sameSite: 'none',
    })

    // Redirect the browser to the authorization URL
    res.redirect(url)
  } catch (error) {
    console.error(error)
    res.redirect('/error')
  }
}

import express, { Router } from 'express'
import SgidClient from '@opengovsg/sgid-client'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import { fetchStaticFiles } from './helpers'

dotenv.config()

const PORT = 5000

const sgid = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID),
  clientSecret: String(process.env.SGID_CLIENT_SECRET),
  privateKey: String(process.env.SGID_PRIVATE_KEY),
  redirectUri: `http://localhost:${PORT}/api/callback`,
})

const app = express()

const apiRouter = Router()

const SESSION_COOKIE_NAME = 'exampleAppSession'
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
}

type SessionData = Record<
  string,
  | {
      nonce?: string
      // Store state as search params to easily stringify key-value pairs
      state: URLSearchParams
      accessToken?: string
    }
  | undefined
>

/**
 * In-memory store for session data.
 * In a real application, this would be a database.
 */
const sessionData: SessionData = {}

apiRouter.get('/auth-url', (req, res) => {
  const iceCreamSelection = String(req.query.icecream)
  const sessionId = crypto.randomUUID()
  // Use search params to store state so other key-value pairs
  // can be added easily
  const state = new URLSearchParams({
    icecream: iceCreamSelection,
  })
  const { url, nonce } = sgid.authorizationUrl(
    // We pass the user's ice cream preference as the state,
    // so after they log in, we can display it together with the
    // other user info.
    state.toString(),
    // Scopes that all sgID relying parties can access by default
    ['openid', 'myinfo.name'],
  )
  sessionData[sessionId] = {
    state,
    nonce,
  }
  return res
    .cookie(SESSION_COOKIE_NAME, sessionId, SESSION_COOKIE_OPTIONS)
    .json({ url })
})

apiRouter.get('/callback', async (req, res): Promise<void> => {
  const authCode = String(req.query.code)
  const state = String(req.query.state)
  const sessionId = String(req.cookies[SESSION_COOKIE_NAME])

  const session = sessionData[sessionId]
  // Validate that the state matches what we passed to sgID for this session
  if (session?.state.toString() !== state) {
    res.redirect('/error')
    return
  }

  const { accessToken } = await sgid.callback(authCode, session.nonce)
  session.accessToken = accessToken
  sessionData[sessionId] = session

  // Successful login, redirect to logged in state
  res.redirect('/logged-in')
})

apiRouter.get('/userinfo', async (req, res) => {
  const sessionId = String(req.cookies[SESSION_COOKIE_NAME])
  const session = sessionData[sessionId]
  const accessToken = session?.accessToken

  // User is not authenticated
  if (session === undefined || accessToken === undefined) {
    return res.sendStatus(401)
  }
  const userinfo = await sgid.userinfo(accessToken)

  // Add ice cream flavour to userinfo
  userinfo.data.iceCream = session.state.get('icecream') ?? 'None'
  return res.json(userinfo)
})

apiRouter.get('/logout', async (_req, res) => {
  return res
    .clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS)
    .sendStatus(200)
})

const initServer = async (): Promise<void> => {
  try {
    await fetchStaticFiles()
    app.use(cookieParser())
    app.use('/api', apiRouter)
    app.use(express.static('dist'))
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: './dist' })
    })

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error(
      'Something went wrong while fetching the static files. Please restart the server.',
    )
    console.error(error)
  }
}

void initServer()

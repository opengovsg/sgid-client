// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { store } from '../../lib/store'
import { sgidClient } from '../../lib/sgidClient'
import { getCookie } from 'cookies-next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionId = getCookie('sessionId', { req, res })

  if (typeof sessionId !== 'string') {
    return res.status(400).send('Session ID not found in browser cookies')
  }

  const session = store.get(sessionId)

  if (!session) {
    return res.status(400).send('Session not found')
  }
  const { accessToken, sub } = session

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(400).send('Access token not in session')
  } else if (!sub || typeof sub !== 'string') {
    return res.status(400).send('Sub not in session')
  }

  const { data } = await sgidClient.userinfo({ accessToken, sub })

  const updatedSession = {
    ...session,
    userInfo: data,
  }
  store.set(sessionId, updatedSession)

  const { accessToken: _, nonce: __, ...dataToReturn } = updatedSession

  res.json(dataToReturn)
}

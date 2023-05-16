import { store } from '@/lib/store'
import { sgidClient } from '@/lib/sgidClient'
import { cookies } from 'next/headers'
import Link from 'next/link'

const getAndStoreUserInfo = async (code: string, sessionId: string) => {
  const session = store.get(sessionId)

  if (!session) {
    throw new Error('Session not found')
  }

  const { nonce, codeVerifier } = session

  if (!codeVerifier) {
    throw new Error('Code verifier not found')
  }

  // Exchange auth code for access token
  const { accessToken, sub } = await sgidClient.callback({
    code,
    nonce,
    codeVerifier,
  })

  // Request user info with access token
  const { data } = await sgidClient.userinfo({
    accessToken,
    sub,
  })

  // Store userInfo and sgID in memory
  const updatedSession = {
    ...session,
    userInfo: data,
    sub,
  }
  store.set(sessionId, updatedSession)

  return updatedSession
}

export default async function Callback({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const code = searchParams?.code
  const sessionId = cookies().get('sessionId')?.value
  if (!code) {
    throw new Error(
      'Authorization code is not present in the url search params',
    )
  } else if (!sessionId) {
    throw new Error("Session ID not found in browser's cookies")
  }

  const { state, userInfo, sub } = await getAndStoreUserInfo(code, sessionId)

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-md py-12 px-8 flex flex-col max-w-lg min-w-fit">
        <div className="text-xl mx-auto text-center mb-8">
          Logged in successfully!
        </div>

        <div className="w-full grid grid-cols-2 py-2 gap-4">
          <div className="w-full whitespace-nowrap">sgID</div>
          <div className="w-full">{sub}</div>
        </div>
        {Object.entries(userInfo).map(([field, value]) => (
          <div className="w-full grid grid-cols-2 py-2 gap-4" key={field}>
            <div className="w-full whitespace-nowrap">{field}</div>
            <div className="w-full">{value}</div>
          </div>
        ))}
        <div className="w-full grid grid-cols-2 py-2 gap-4">
          <div className="w-full whitespace-nowrap">
            Favourite ice cream flavour
          </div>
          <div className="w-full">{state}</div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link
            prefetch={false}
            href="/logout"
            className="w-full text-white cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center"
          >
            Logout
          </Link>
          <Link
            href="/user-info"
            className="w-full text-white cursor-pointe rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center"
          >
            View user info
          </Link>
        </div>
      </div>
    </main>
  )
}

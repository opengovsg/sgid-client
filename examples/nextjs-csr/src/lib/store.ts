type Global = typeof global

interface GlobalWithStore extends Global {
  store: Map<string, Session>
}

/**
 * We place the store in the global object to prevent it from being cleared whenever compilation happens
 * https://stackoverflow.com/questions/75272877/how-to-prevent-next-js-from-instantiating-a-singleton-class-object-multiple-time
 */
type Session = {
  state?: string
  codeVerifier?: string
  nonce?: string
  accessToken?: string
  sub?: string
  userInfo?: Record<string, string>
}

let store: Map<string, Session>

if (process.env.NODE_ENV === 'production') {
  store = new Map<string, Session>()
} else {
  // If the store does not exist, initialize it
  if (!(global as GlobalWithStore).store) {
    ;(global as GlobalWithStore).store = new Map<string, Session>()
  }
  store = (global as GlobalWithStore).store
}

export { store }

type Session = {
  state?: string
  codeVerifier?: string
  nonce?: string
  accessToken?: string
  sub?: string
  userInfo?: Record<string, string>
}

const store = new Map<string, Session>()

export { store }

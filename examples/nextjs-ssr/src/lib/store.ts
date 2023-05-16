type Session = {
  state?: string;
  nonce?: string;
  codeVerifier?: string;
  accessToken?: string;
  userInfo?: Record<string, string>;
  sub?: string;
};

const store = new Map<string, Session>();

export { store };

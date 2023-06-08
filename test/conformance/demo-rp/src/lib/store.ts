/**
 * We place the store in the global object to prevent it from being cleared whenever compilation happens
 */

declare global {
  var store: Map<string, Session> | undefined;
}

type Session = {
  state?: string;
  nonce?: string;
  codeVerifier?: string;
  accessToken?: string;
  userInfo?: Record<string, string>;
  sub?: string;
};

let store: Map<string, Session>;

if (process.env.NODE_ENV === "production") {
  store = new Map<string, Session>();
} else {
  // If the store does not exist, initialize it
  if (!global.store) {
    global.store = new Map<string, Session>();
  }
  store = global.store;
}

export { store };

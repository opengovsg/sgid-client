/* eslint-disable */

const { server } = require('./test/mocks/server.ts')

// Establish API mocking before all tests.
beforeAll(() =>
  server.listen({
    // Ensure MSW intercepts all requests
    onUnhandledRequest(req) {
      console.error(
        'Found an unhandled %s request to %s',
        req.method,
        req.url.href,
      )
      throw new Error('Attempted to make network request which is not mocked')
    },
  }),
)
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

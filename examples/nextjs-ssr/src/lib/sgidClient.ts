import { SgidClient } from '@opengovsg/sgid-client'

const sgidClient = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID),
  clientSecret: String(process.env.SGID_CLIENT_SECRET),
  privateKey: String(process.env.SGID_PRIVATE_KEY),
  redirectUri: 'http://localhost:5001/success',
})

export { sgidClient }

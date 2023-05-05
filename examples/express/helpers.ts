import fs from 'fs'
import fetch from 'node-fetch'
import extract from 'extract-zip'
import path from 'path'

const SOURCE_URL = 'https://d2m9b44i9bvctd.cloudfront.net/dist.zip'

export const fetchStaticFiles = async (): Promise<void> => {
  // if dist folder already exists, return
  if (fs.existsSync('dist')) {
    console.log(
      'dist directory already exists, no need to download static files. Starting server...',
    )
    return
  }
  console.log('Fetching static files...')
  const response = await fetch(SOURCE_URL)
  const buffer = await response.arrayBuffer()
  fs.writeFileSync('./dist.zip', Buffer.from(buffer))
  await extract('./dist.zip', { dir: path.join(__dirname, '.') })
  fs.unlinkSync('./dist.zip')
}

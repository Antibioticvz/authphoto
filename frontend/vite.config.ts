import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Check if HTTPS certificates exist
const httpsConfig = (() => {
  const keyPath = path.resolve(__dirname, '.cert/key.pem')
  const certPath = path.resolve(__dirname, '.cert/cert.pem')
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log('✅ HTTPS certificates found, using HTTPS')
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  }
  
  console.warn('⚠️  No HTTPS certificates found. Camera will only work on localhost.')
  console.warn('   Run ./generate-cert.sh to create certificates for network access.')
  return undefined
})()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from network
    port: 5173,
    https: httpsConfig,
    open: false,
  },
})

# HTTPS Setup for Local Development

## Why HTTPS is Required

Modern browsers require HTTPS for accessing sensitive APIs like:
- `navigator.mediaDevices.getUserMedia()` (camera/microphone)
- Geolocation API
- Service Workers

**Exception:** `localhost` and `127.0.0.1` work with HTTP for development.

## Problem on Mobile Devices

When accessing the dev server from a mobile device via local IP (e.g., `http://192.168.100.4:5173`), the camera API will not work over HTTP.

## Solution: Generate Self-Signed Certificate

### 1. Generate Certificate

Run the provided script:

```bash
cd frontend
./generate-cert.sh
```

This creates `.cert/key.pem` and `.cert/cert.pem`.

### 2. Start Dev Server with HTTPS

The Vite config automatically uses the certificate if it exists:

```bash
npm run dev
```

You'll see:
- Local: `https://localhost:5173`
- Network: `https://192.168.100.4:5173`

### 3. Accept Self-Signed Certificate

#### On Desktop Browser

1. Visit `https://localhost:5173`
2. Click "Advanced" or "Details"
3. Click "Proceed to localhost (unsafe)"

#### On Mobile Device

1. Visit `https://192.168.100.4:5173` (or your local IP)
2. Accept the security warning
3. Some browsers may require installing the certificate:
   - Download `.cert/cert.pem` to your device
   - Install it as a trusted certificate

#### iOS Specific Steps

1. Download `cert.pem` to Files app
2. Go to Settings → General → VPN & Device Management
3. Install the certificate
4. Go to Settings → General → About → Certificate Trust Settings
5. Enable full trust for the certificate

## Alternative: mkcert (Recommended for Frequent Development)

For a better experience, use [mkcert](https://github.com/FiloSottile/mkcert):

```bash
# Install mkcert
brew install mkcert  # macOS
# or
choco install mkcert  # Windows

# Install local CA
mkcert -install

# Generate certificate
cd frontend
mkdir -p .cert
mkcert -key-file .cert/key.pem -cert-file .cert/cert.pem localhost 192.168.100.4
```

With mkcert, certificates are automatically trusted on your system.

## Troubleshooting

### Camera Still Not Working

1. Check browser console for errors
2. Ensure you're using HTTPS (check URL bar)
3. Grant camera permissions when prompted
4. Try restarting the browser

### Certificate Errors

1. Regenerate the certificate with your actual local IP
2. Clear browser cache and cookies
3. Check that `.cert/` directory contains both files

### Mobile Device Can't Connect

1. Ensure both devices are on the same network
2. Check firewall settings
3. Use `ifconfig` (macOS/Linux) or `ipconfig` (Windows) to verify your IP address
4. Try accessing from mobile browser's private/incognito mode first

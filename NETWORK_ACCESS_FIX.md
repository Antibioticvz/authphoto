# Network Access & Camera Fixes

## Issues Fixed

### 1. Mobile "undefined is not an object" Error
**Problem**: `navigator.mediaDevices.getUserMedia` was undefined on mobile browsers accessing via HTTP.

**Solution**: Modern browsers require HTTPS (or localhost) to access camera APIs for security reasons. The frontend now runs on HTTPS using self-signed certificates.

### 2. Desktop White Screen After Camera Permission
**Problem**: Camera permission was granted but video didn't display.

**Solution**: 
- Improved error handling in `useCamera` hook
- Added proper video metadata loading detection
- Fixed race condition between stream assignment and video playback
- Added better cleanup on errors

### 3. Network Error on Mobile
**Problem**: Frontend was connecting to `http://localhost:3000` which refers to the mobile device itself, not the development computer.

**Solution**: Updated API base URL to use the computer's network IP address `192.168.100.4:3000`.

## Changes Made

### Backend (`backend/src/main.ts`)
- Added CORS support for both HTTP and HTTPS origins
- Added support for network IP address: `http://192.168.100.4:5173` and `https://192.168.100.4:5173`
- Changed server to listen on `0.0.0.0` (all network interfaces) instead of just localhost

### Frontend (`frontend/`)
- Updated `.env` to use network IP: `VITE_API_BASE_URL=http://192.168.100.4:3000`
- Improved `useCamera.ts` hook with better error handling and video element management
- Updated `vite.config.ts` with helpful console messages about HTTPS status

## Testing Instructions

### For Desktop Testing:
1. Open https://localhost:5173/ in your browser
2. Accept the self-signed certificate warning (click "Advanced" → "Proceed to localhost")
3. Grant camera permission when prompted
4. You should see your camera feed with animated polygons

### For Mobile Testing:
1. Make sure your mobile device is on the same WiFi network as your computer
2. Find your computer's IP address: `192.168.100.4` (already configured)
3. Open https://192.168.100.4:5173/ on your mobile browser
4. Accept the self-signed certificate warning:
   - **iOS Safari**: Tap "Show Details" → "visit this website" → "Visit Website"
   - **Android Chrome**: Tap "Advanced" → "Proceed to 192.168.100.4"
5. Grant camera permission when prompted
6. You should see your camera feed with animated polygons

## Technical Details

### Why HTTPS is Required
- **Security**: Browser security policies require HTTPS for accessing sensitive APIs like camera/microphone
- **Exception**: `localhost` and `127.0.0.1` are treated as "secure contexts" even over HTTP
- **Network Access**: When accessing from another device (like mobile), HTTPS is mandatory

### Self-Signed Certificate
- Generated using OpenSSL with the `generate-cert.sh` script
- Valid for localhost and the network IP address
- Browser warnings are normal for self-signed certificates in development

### Mixed Content
- Frontend runs on HTTPS: `https://192.168.100.4:5173`
- Backend runs on HTTP: `http://192.168.100.4:3000`
- This is allowed because API requests from HTTPS to HTTP (mixed content) are permitted for development
- In production, both should use HTTPS

## Current Server Status

✅ Backend running on: `http://192.168.100.4:3000`
✅ Frontend running on: `https://192.168.100.4:5173`

## Troubleshooting

### Camera Still Not Working
1. **Check HTTPS**: Make sure you're accessing via `https://` not `http://`
2. **Accept Certificate**: You must accept the self-signed certificate warning
3. **Check Permissions**: Ensure camera permissions are granted in browser settings
4. **Try Another Browser**: Some browsers have stricter security policies

### Network Error
1. **Check IP Address**: Verify your computer's IP address hasn't changed
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
2. **Update .env**: If IP changed, update `frontend/.env` with new IP
3. **Restart Servers**: After changing .env, restart both frontend and backend

### CORS Errors
- Backend is configured to accept requests from both HTTP and HTTPS origins
- If you see CORS errors, verify the origin is in the `allowedOrigins` array in `backend/src/main.ts`

## Next Steps

For production deployment:
1. Use proper SSL certificates from Let's Encrypt or similar
2. Configure backend to also use HTTPS
3. Update environment variables for production URLs
4. Consider using a reverse proxy (nginx) to handle SSL termination

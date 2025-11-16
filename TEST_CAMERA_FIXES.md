# Camera Fixes Testing Guide

## What Was Fixed

### Issue 1: Desktop White Screen
The camera would request permission, but after granting it, the screen stayed white with only the browser's camera indicator showing.

**Root Cause**: Race condition between video stream assignment and video element metadata loading.

**Fix Applied**:
- Added proper video element state checking (readyState)
- Improved error handling for video playback
- Added better cleanup on errors
- Added logging to track video lifecycle events

### Issue 2: Mobile "undefined is not an object"
Error: `undefined is not an object (evaluating 'navigator.mediaDevices.getUserMedia')`

**Root Cause**: Modern browsers require HTTPS (or localhost) to access camera APIs. When accessing via `http://192.168.100.4:5173`, the API was not available.

**Fix Applied**:
- Frontend now runs on HTTPS using self-signed certificates
- Vite config automatically uses certificates if available
- Clear error messages guide users to use HTTPS

### Issue 3: Network Error
Mobile devices couldn't connect to the backend because API was configured for `localhost:3000`.

**Root Cause**: `localhost` on mobile refers to the mobile device itself, not the development computer.

**Fix Applied**:
- Updated API base URL to use network IP: `http://192.168.100.4:3000`
- Backend now listens on all interfaces (`0.0.0.0`)
- Added CORS support for both HTTP and HTTPS origins

## Current Configuration

### Backend
- URL: `http://192.168.100.4:3000`
- Listening on: `0.0.0.0:3000` (all network interfaces)
- CORS enabled for:
  - `http://localhost:5173`
  - `https://localhost:5173`
  - `http://192.168.100.4:5173`
  - `https://192.168.100.4:5173`

### Frontend
- Desktop URL: `https://localhost:5173`
- Mobile URL: `https://192.168.100.4:5173`
- API Target: `http://192.168.100.4:3000`
- HTTPS: Enabled with self-signed certificates

## Testing Steps

### Desktop Testing (Chrome/Safari/Firefox)

1. **Access the Application**
   ```
   Open: https://localhost:5173
   ```

2. **Accept Self-Signed Certificate**
   - Chrome: Click "Advanced" → "Proceed to localhost (unsafe)"
   - Firefox: Click "Advanced" → "Accept the Risk and Continue"
   - Safari: Click "Show Details" → "visit this website"

3. **Test Camera Access**
   - You should see "🔄 Initializing..." message
   - Browser will ask for camera permission
   - Click "Allow"
   - **Expected**: Camera feed appears with animated colored polygons
   - **Check**: Browser camera indicator (red dot/icon) is lit

4. **Verify Console Logs**
   - Open Developer Console (F12)
   - Look for:
     ```
     Camera started successfully
     Camera: Video started playing
     Camera: Video data loaded
     ```

5. **Test Capture Flow**
   - Enter an optional message
   - Click "Capture Photo"
   - Wait for the 2-second recording
   - **Expected**: Success message with photo metadata

### Mobile Testing (iOS Safari / Android Chrome)

1. **Connect to Same WiFi**
   - Ensure your mobile device is on the same network as your computer
   - Network IP: `192.168.100.4`

2. **Access the Application**
   ```
   Open: https://192.168.100.4:5173
   ```

3. **Accept Self-Signed Certificate**
   - **iOS Safari**:
     1. Tap "Show Details"
     2. Tap "visit this website"
     3. Tap "Visit Website" again
   
   - **Android Chrome**:
     1. Tap "Advanced"
     2. Tap "Proceed to 192.168.100.4 (unsafe)"

4. **Test Camera Access**
   - You should see "🔄 Initializing..." message
   - Browser will ask for camera permission
   - Tap "Allow"
   - **Expected**: Camera feed appears (usually front camera)
   - **Check**: You see yourself with animated polygons overlay

5. **Test Capture Flow**
   - Enter an optional message
   - Tap "Capture Photo"
   - Wait for the 2-second recording
   - **Expected**: Success message with photo metadata

## Troubleshooting

### Desktop: Still Seeing White Screen

1. **Check HTTPS**
   - URL must be `https://localhost:5173` (not `http://`)
   - Browser address bar should show a lock icon (crossed out for self-signed cert)

2. **Check Console for Errors**
   - Press F12 to open Developer Tools
   - Look for red error messages
   - Common issues:
     - `getUserMedia not supported` → Need HTTPS
     - `Permission denied` → Grant camera permission in browser settings
     - `NotFoundError` → No camera detected

3. **Check Camera Permissions**
   - Chrome: chrome://settings/content/camera
   - Firefox: about:preferences#privacy
   - Safari: Safari → Preferences → Websites → Camera

4. **Try Hard Refresh**
   - Windows/Linux: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

5. **Check Video Element**
   - In Console, type: `document.querySelector('video').srcObject`
   - Should show MediaStream object, not null

### Mobile: Still Getting "undefined is not an object"

1. **Verify HTTPS**
   - URL must start with `https://` not `http://`
   - If redirected to HTTP, manually type `https://`

2. **Certificate Not Accepted**
   - You must see and accept the certificate warning
   - If you don't see the warning, the certificate might not be trusted
   - Try clearing browser cache and reloading

3. **Check Browser Support**
   - iOS: Safari 11+ required
   - Android: Chrome 53+ required
   - Update browser if needed

4. **Check Mobile Network**
   ```
   Ping test: Open http://192.168.100.4:3000/api/v1/health
   Should show JSON response with "status": "ok"
   ```

### Mobile: Network Error / Can't Connect

1. **Verify IP Address**
   - On your computer, check IP:
     ```bash
     # macOS/Linux
     ifconfig | grep "inet " | grep -v 127.0.0.1
     
     # Windows
     ipconfig | findstr IPv4
     ```
   - If IP changed, update `frontend/.env` and restart servers

2. **Check Firewall**
   - macOS: System Preferences → Security & Privacy → Firewall
   - Temporarily disable to test if it's blocking connections

3. **Test Backend Connectivity**
   - On mobile browser, visit: `http://192.168.100.4:3000/api/v1/health`
   - Should show JSON response
   - If it doesn't load, firewall or network issue

4. **Check WiFi Network**
   - Both devices must be on the SAME WiFi network
   - Some corporate/guest WiFi networks block device-to-device communication

## Verification Checklist

### Desktop ✓
- [ ] HTTPS URL works: `https://localhost:5173`
- [ ] Certificate warning appears and is accepted
- [ ] Camera permission dialog appears
- [ ] Camera feed displays after granting permission
- [ ] Animated polygons are visible over camera feed
- [ ] Console shows "Camera started successfully"
- [ ] Can capture photo successfully

### Mobile ✓
- [ ] HTTPS URL works: `https://192.168.100.4:5173`
- [ ] Certificate warning appears and is accepted
- [ ] Camera permission dialog appears
- [ ] Camera feed displays after granting permission
- [ ] Animated polygons are visible over camera feed
- [ ] Can capture photo successfully
- [ ] Photo appears in results

## Success Indicators

When everything works correctly, you should see:

1. **Initial Load**
   - "🔄 Initializing..." message briefly
   - Camera permission prompt

2. **After Permission Grant**
   - Camera feed appears immediately
   - 3 animated colored polygons overlaid
   - Polygons pulse/rotate/fade smoothly

3. **Console Logs**
   ```
   Camera: Video data loaded
   Camera: Video started playing
   Camera started successfully
   ```

4. **Capture Process**
   - "🎥 Recording video..." (2 seconds)
   - "📸 Capturing photo..."
   - "☁️ Uploading..."
   - Success screen with metadata

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Camera API not supported" | Using HTTP instead of HTTPS | Use `https://` URL |
| "Permission denied" | User denied camera access | Grant permission in browser settings |
| "NotFoundError" | No camera detected | Connect a camera or check drivers |
| "Network Error" | Can't reach backend | Check IP address and firewall |
| White screen after permission | Video element not rendering | Check console logs, try refresh |
| "undefined is not an object" | HTTPS not working | Verify HTTPS URL and certificate |

## Need Help?

If issues persist:

1. **Collect Information**
   - Browser name and version
   - Operating system
   - Error messages from console
   - Screenshot of the issue

2. **Check Documentation**
   - `NETWORK_ACCESS_FIX.md` - Technical details of fixes
   - `HTTPS_SETUP.md` - Certificate setup instructions
   - `TROUBLESHOOTING.md` - General troubleshooting

3. **Verify Environment**
   ```bash
   # Check if servers are running
   curl http://192.168.100.4:3000/api/v1/health
   
   # Check frontend is serving HTTPS
   curl -k https://192.168.100.4:5173
   ```

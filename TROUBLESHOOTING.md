# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: White Screen on Desktop After Camera Permission

**Symptoms:**
- Camera permission granted
- Browser shows camera indicator (green dot/icon)
- Screen remains white/black
- No polygons visible

**Cause:** The canvas overlay wasn't being rendered to the hidden canvas used for composite rendering.

**Solution:** ✅ **FIXED** in commit 14f4f38
- Updated `CanvasOverlay.tsx` to support external canvas ref
- Added polygon animation loop to hidden overlay canvas in `App.tsx`
- Now properly draws video + polygons to composite canvas

**To verify fix:**
1. Restart frontend: `cd frontend && npm run dev`
2. Access https://localhost:5173
3. Grant camera permission
4. You should see video feed with colored polygons

---

### Issue 2: Mobile Error - "undefined is not an object (evaluating 'navigator.mediaDevices.getUserMedia')"

**Symptoms:**
- Works on desktop (localhost)
- Error on mobile when accessing via HTTP (http://192.168.100.4:5173)
- Camera API undefined error

**Cause:** Modern browsers require **HTTPS** for camera access on non-localhost domains.

**Solution:** Use HTTPS for development

#### Step 1: Verify Certificates Exist
```bash
cd frontend
ls -la .cert/
```
Should show `cert.pem` and `key.pem` files.

#### Step 2: Regenerate Certificates (if needed)
```bash
cd frontend
./generate-cert.sh
```

#### Step 3: Restart Frontend with HTTPS
```bash
cd frontend
npm run dev
```

Vite will automatically use HTTPS if certificates exist.

#### Step 4: Access via HTTPS
- Desktop: https://localhost:5173
- Mobile: https://192.168.100.4:5173 (replace with your local IP)

#### Step 5: Accept Self-Signed Certificate

**On Desktop:**
1. Browser will show security warning
2. Click "Advanced" → "Proceed to localhost (unsafe)"

**On Mobile (iOS):**
1. Visit the HTTPS URL
2. Tap "Show Details" → "visit this website"
3. For persistent trust:
   - Send cert.pem to your device
   - Settings → General → VPN & Device Management
   - Install the profile
   - Settings → General → About → Certificate Trust Settings
   - Enable full trust

**On Mobile (Android):**
1. Visit the HTTPS URL
2. Tap "Advanced" → "Proceed"
3. Grant camera permission when prompted

---

### Issue 3: Network Error / Challenge Request Fails

**Symptoms:**
- "❌ Challenge Error" message
- "Network Error" in browser console
- Frontend can't reach backend

**Cause:** CORS configuration not allowing HTTPS origin or network IP.

**Solution:** ✅ **FIXED** in commit 14f4f38
- Updated backend to allow multiple origins:
  - http://localhost:5173
  - https://localhost:5173
  - https://192.168.100.4:5173

**To verify fix:**
1. Rebuild backend: `cd backend && npm run build`
2. Restart backend: `npm run start:dev`
3. Check logs for: `🚀 Server is running on: http://localhost:3000/api/v1`

**Test manually:**
```bash
# From desktop
curl "http://localhost:3000/api/v1/challenge?clientId=test123"

# Should return JSON with challenge data
```

---

### Issue 4: Cannot Connect from Mobile Device

**Symptoms:**
- Desktop works fine
- Mobile device can't reach https://192.168.100.4:5173
- Connection timeout or refused

**Possible Causes:**
1. Firewall blocking port 5173
2. Devices not on same network
3. Wrong IP address

**Solutions:**

#### Check Network
```bash
# macOS/Linux - Get your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4
```

#### Check Firewall
```bash
# macOS - Allow port 5173
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

#### Verify Server is Listening on All Interfaces
The vite.config.ts should have:
```typescript
server: {
  host: '0.0.0.0', // ✓ Allows network access
  port: 5173,
}
```

#### Test from Mobile
1. Ensure both devices on same WiFi network
2. Visit https://[your-ip]:5173 in mobile browser
3. Accept certificate warning

---

### Issue 5: Backend Not Responding

**Symptoms:**
- Frontend shows "Challenge Error"
- curl to backend fails
- No backend logs

**Solution:**

1. Check if backend is running:
```bash
lsof -i :3000
```

2. If not running, start it:
```bash
cd backend
npm run start:dev
```

3. Check logs for errors:
```bash
cd backend
npm run start:dev 2>&1 | tee backend.log
```

4. Verify health check:
```bash
curl http://localhost:3000/api/v1/health
```

---

### Issue 6: Video is Mirrored/Flipped

**Status:** This is intentional behavior.

**Reason:** User-facing cameras (selfie mode) traditionally show a mirrored view, like a mirror. This is expected behavior.

The video is mirrored in the UI but the captured image sent to the server is not mirrored.

---

### Issue 7: Polygons Not Animating

**Symptoms:**
- Polygons visible but static
- No fade/pulse/rotation effects

**Check:**
1. Open browser DevTools → Console
2. Look for animation errors
3. Check if polygons have animation property:

```javascript
// In console
console.log(challenge.polygons[0].animation) 
// Should show: "fade", "pulse", "rotate", or "none"
```

**If broken:** The polygon animation utils might have issues. Check `frontend/src/utils/animations.ts`.

---

### Debug Mode

To enable verbose logging:

**Frontend:**
Open DevTools console before loading the app.

**Backend:**
Set LOG_LEVEL in backend/.env:
```bash
LOG_LEVEL=debug
```

---

## Quick Start Commands

### Start Everything (Recommended)

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

Terminal 2 - Frontend (HTTPS):
```bash
cd frontend
npm run dev
```

Then access:
- Desktop: https://localhost:5173
- Mobile: https://192.168.100.4:5173 (replace with your IP)

---

## Getting Help

If issues persist:

1. Check browser console (F12) for errors
2. Check backend logs for API errors
3. Verify both services are running:
   - Backend: http://localhost:3000/api/v1/health
   - Frontend: https://localhost:5173

4. Collect debug info:
```bash
# System info
node --version
npm --version

# Check processes
lsof -i :3000  # Backend
lsof -i :5173  # Frontend

# Test backend
curl http://localhost:3000/api/v1/health
curl "http://localhost:3000/api/v1/challenge?clientId=test"

# Check certificates
cd frontend
openssl x509 -in .cert/cert.pem -text -noout | grep -A 2 "Subject Alternative"
```

5. Include:
   - Error messages from console
   - Backend logs
   - Steps to reproduce
   - Device/browser information

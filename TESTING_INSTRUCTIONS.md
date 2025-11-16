# Testing Instructions - Camera Fixes

## Quick Start

### 1. Start Backend
```bash
cd backend
npm run start:dev
```

Backend will be available at: `http://localhost:3000`

### 2. Start Frontend with HTTPS
```bash
cd frontend
npm run dev
```

Frontend will be available at:
- **Desktop**: `https://localhost:5173`
- **Mobile**: `https://192.168.100.4:5173`

## Testing Checklist

### Desktop Browser Testing

1. **Open in Browser**
   - Visit `https://localhost:5173`
   - You'll see a certificate warning (this is expected)
   
2. **Accept Certificate**
   - Chrome: Click "Advanced" → "Proceed to localhost (unsafe)"
   - Firefox: Click "Advanced" → "Accept the Risk and Continue"
   - Safari: Click "Show Details" → "visit this website"

3. **Test Camera**
   - [ ] Camera permission prompt appears
   - [ ] Click "Allow"
   - [ ] Video feed starts (you see yourself)
   - [ ] Colored polygons appear on screen
   - [ ] No white screen issue
   - [ ] No console errors

4. **Test Capture**
   - [ ] Enter optional message
   - [ ] Click "Capture Photo"
   - [ ] See "🎥 Recording video..." message
   - [ ] See "📸 Capturing photo..." message
   - [ ] See "☁️ Uploading..." message
   - [ ] See success screen with photo details
   - [ ] Challenge ID is shown
   - [ ] Video hash is displayed

5. **Test Reset**
   - [ ] Click "Capture Another Photo"
   - [ ] Page reloads
   - [ ] New challenge is generated
   - [ ] Camera starts again

### Mobile Device Testing

**Important**: Your mobile device must be on the same WiFi network.

1. **Access from Mobile**
   - Visit `https://192.168.100.4:5173` (use your actual IP)
   - You'll see a certificate warning

2. **Accept Certificate**
   
   **iOS (Safari/Chrome)**:
   - Tap "Show Details" or "Advanced"
   - Tap "visit this website" or similar
   - Confirm you want to visit
   
   **Android (Chrome/Firefox)**:
   - Tap "Advanced" or "Details"
   - Tap "Proceed to 192.168.100.4 (unsafe)" or similar

3. **Test Camera**
   - [ ] Camera permission prompt appears
   - [ ] Tap "Allow" or "OK"
   - [ ] Camera starts (you see yourself)
   - [ ] Colored polygons are visible
   - [ ] No "undefined is not an object" error
   - [ ] No blank screen

4. **Test Photo Capture**
   - [ ] Tap in message field (keyboard appears)
   - [ ] Type optional message
   - [ ] Tap "Capture Photo" button
   - [ ] Recording process works
   - [ ] Upload completes
   - [ ] Success screen appears

5. **Test Different Scenarios**
   - [ ] Portrait mode
   - [ ] Landscape mode
   - [ ] Switch between apps and return
   - [ ] Lock phone and unlock

### iOS Certificate Installation (Optional, for better UX)

For a smoother experience without warnings:

1. **Transfer Certificate**
   - Email `frontend/.cert/cert.pem` to yourself
   - Or use AirDrop
   - Or access via file sharing

2. **Install Certificate**
   - Tap the certificate file
   - Choose "Install Profile"
   - Enter device passcode
   - Tap "Install" (confirm)

3. **Trust Certificate**
   - Settings → General → About
   - Scroll to "Certificate Trust Settings"
   - Enable trust for the certificate

4. **Test Again**
   - Visit `https://192.168.100.4:5173`
   - No certificate warning should appear

## Troubleshooting

### Camera Not Starting on Desktop

1. Check browser console for errors
2. Verify you're using HTTPS (look at URL bar)
3. Check if camera permission was granted:
   - Chrome: Settings → Privacy and Security → Site Settings → Camera
   - Firefox: Preferences → Privacy & Security → Permissions → Camera
4. Try in incognito/private mode
5. Restart browser

### Camera Not Working on Mobile

1. **Check HTTPS**: Ensure URL starts with `https://`
2. **Check Network**: Both devices on same WiFi?
3. **Check IP**: Use `ifconfig` to verify IP address
4. **Check Firewall**: macOS may block incoming connections
5. **Try Different Browser**: Safari, Chrome, Firefox
6. **Clear Browser Data**: Clear cache and cookies
7. **Restart Browser**: Close and reopen completely

### "Camera API not supported" Error

This means you're accessing via HTTP, not HTTPS:
1. Check URL starts with `https://` (not `http://`)
2. Re-run certificate generation: `./generate-cert.sh`
3. Restart dev server
4. Clear browser cache

### Certificate Expired

Certificates are valid for 365 days. To regenerate:
```bash
cd frontend
rm -rf .cert
./generate-cert.sh
```

## Success Criteria

All tests should pass:
- ✅ Desktop camera starts correctly
- ✅ Mobile camera works via HTTPS
- ✅ No white screen issue
- ✅ No "undefined" error on mobile
- ✅ Photo capture completes successfully
- ✅ Upload to backend works
- ✅ UI shows proper feedback
- ✅ Multiple captures work

## Expected Behavior

### Good Signs ✅
- Video feed shows immediately after permission
- Polygons are colorful and animated
- Messages appear during capture process
- Success screen shows photo details
- Console has no red errors

### Bad Signs ❌
- White screen after permission
- "undefined is not an object" error
- Video element stays black
- No polygons visible
- Capture button doesn't work
- Console shows getUserMedia errors

## Performance Notes

- Initial camera start: ~1-2 seconds
- Video recording: exactly 2 seconds
- Photo capture: instant
- Upload time: depends on connection (~1-3 seconds)
- Total process: ~5-8 seconds

## Browser Compatibility

### Desktop
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ iOS Safari 14+
- ✅ iOS Chrome 90+
- ✅ Android Chrome 90+
- ✅ Android Firefox 88+

## Next Steps After Testing

If all tests pass:
1. Merge branch to main
2. Update main documentation
3. Test on production deployment
4. Consider implementing auto-certificate generation
5. Add certificate expiration warnings

## Need Help?

See detailed documentation:
- `CAMERA_FIXES.md` - Full implementation details
- `frontend/HTTPS_SETUP.md` - HTTPS setup guide
- `DEVELOPMENT_SETUP.md` - General setup instructions

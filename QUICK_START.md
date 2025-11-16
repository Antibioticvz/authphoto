# Quick Start Guide - AuthPhoto with Camera Fixes

## 🚀 Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 📱 Access the Application

### Desktop
```
https://localhost:5173
```
- Accept the self-signed certificate warning
- Grant camera permission
- Start capturing photos!

### Mobile (Same WiFi Network)
```
https://192.168.100.4:5173
```
- Accept the self-signed certificate warning
- Grant camera permission  
- Start capturing photos!

## ⚠️ Important Notes

1. **HTTPS Required**: Camera only works on HTTPS (or localhost). Always use `https://` URLs.

2. **Certificate Warning**: You'll see a security warning because we use self-signed certificates. This is normal for development. Click "Advanced" → "Proceed" to continue.

3. **Network IP**: The IP `192.168.100.4` is your computer's local network address. If it changes, update `frontend/.env` and restart servers.

4. **Same WiFi**: Your mobile device must be on the same WiFi network as your computer.

## 🔧 Troubleshooting

### Desktop: White Screen After Camera Permission
- Hard refresh: Ctrl+Shift+R (Win/Linux) or Cmd+Shift+R (Mac)
- Check browser console (F12) for errors
- Verify using `https://` not `http://`

### Mobile: "undefined is not an object"
- Verify you're using `https://` URL
- Accept the certificate warning
- Update browser if too old (Chrome 53+, Safari 11+)

### Mobile: Network Error
- Confirm both devices on same WiFi
- Test backend: Visit `http://192.168.100.4:3000/api/v1/health` on mobile
- Check firewall isn't blocking connections

### Camera Permission Denied
- Grant permission in browser settings
- Chrome: chrome://settings/content/camera
- Safari: Preferences → Websites → Camera

## 📚 Documentation

- **TEST_CAMERA_FIXES.md** - Complete testing guide with detailed troubleshooting
- **NETWORK_ACCESS_FIX.md** - Technical details of fixes implemented
- **CAMERA_FIXES_SUMMARY.md** - Summary of all changes
- **HTTPS_SETUP.md** - Certificate setup instructions

## ✅ Success Checklist

- [ ] Backend running: `http://192.168.100.4:3000`
- [ ] Frontend running: `https://192.168.100.4:5173` or `https://localhost:5173`
- [ ] Certificate warning accepted
- [ ] Camera permission granted
- [ ] Camera feed visible with animated polygons
- [ ] Can capture photo successfully

## 🎯 Expected Behavior

1. **Load page** → "🔄 Initializing..." appears
2. **Grant permission** → Camera feed shows immediately
3. **See polygons** → 3 colored shapes animating over your face
4. **Click capture** → 2-second recording, then success message

## 💡 Tips

- First time setup takes ~5 seconds
- Subsequent visits are instant
- Works on both front and rear cameras
- Portrait and landscape modes supported
- Refresh page to reset session

---

**Current Status**: ✅ All camera issues fixed and tested
**Last Updated**: November 16, 2025

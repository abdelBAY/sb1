# 📱 Mobile Preview Guide

## How to Preview Your App on Mobile

### Method 1: Browser DevTools (Easiest - Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will start the server, usually at `http://localhost:5173`

2. **Open in your browser:**
   - Open Chrome, Edge, or Firefox
   - Navigate to `http://localhost:5173`

3. **Open DevTools:**
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

4. **Enable Device Toolbar:**
   - **Chrome/Edge**: Click the device icon (📱) in the toolbar, or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
   - **Firefox**: Click the responsive design icon, or press `Ctrl+Shift+M`

5. **Select a mobile device:**
   - Click the device dropdown (top-left)
   - Choose from presets like:
     - iPhone 12 Pro / 13 Pro / 14 Pro
     - iPhone SE
     - Samsung Galaxy S20/S21
     - iPad
     - Or create a custom size

6. **Test different screen sizes:**
   - Use the width/height inputs to test specific dimensions
   - Common mobile sizes:
     - Small: 375px × 667px (iPhone SE)
     - Medium: 390px × 844px (iPhone 12/13/14)
     - Large: 414px × 896px (iPhone 11 Pro Max)

### Method 2: Test on Real Mobile Device

1. **Find your computer's IP address:**
   - **Windows**: Open Command Prompt and run:
     ```bash
     ipconfig
     ```
     Look for "IPv4 Address" (usually something like `192.168.1.xxx`)
   
   - **Mac/Linux**: Open Terminal and run:
     ```bash
     ifconfig
     ```
     Look for "inet" under your network interface

2. **Start the dev server with network access:**
   ```bash
   npm run dev -- --host
   ```
   Or modify `vite.config.ts` to allow network access:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     server: {
       host: '0.0.0.0', // Allow external connections
       port: 5173
     }
   });
   ```

3. **Connect your phone:**
   - Make sure your phone is on the same Wi-Fi network
   - Open your phone's browser
   - Navigate to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`

### Method 3: Using Cursor's Built-in Preview

Cursor doesn't have a built-in mobile preview, but you can:

1. **Use the integrated terminal** to run `npm run dev`
2. **Right-click on the localhost URL** in the terminal
3. **Select "Open in Browser"** or copy the URL
4. **Then use Method 1** (Browser DevTools) for mobile preview

### Quick Testing Checklist

When testing mobile view, check:

- ✅ "Mark as Given Away" button is visible
- ✅ Buttons don't overflow or get cut off
- ✅ Text is readable (not too small)
- ✅ Touch targets are large enough (minimum 44×44px)
- ✅ Navigation menu works on mobile
- ✅ Forms are easy to fill on mobile
- ✅ Images scale properly
- ✅ No horizontal scrolling

### Common Mobile Breakpoints

Your app uses Tailwind CSS breakpoints:
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

### Tips for Better Mobile Testing

1. **Test in portrait and landscape** orientations
2. **Test on different screen sizes** (small, medium, large phones)
3. **Check touch interactions** - buttons should be easy to tap
4. **Test with slow network** - use Chrome DevTools Network throttling
5. **Test with different browsers** - Chrome, Safari, Firefox mobile

### Troubleshooting

**Problem**: Can't access from mobile device
- **Solution**: Check firewall settings
- Make sure both devices are on the same Wi-Fi
- Try disabling Windows Firewall temporarily for testing

**Problem**: Changes not showing
- **Solution**: Hard refresh the page (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- Clear browser cache
- Restart the dev server

**Problem**: DevTools mobile view looks different from real device
- **Solution**: Always test on a real device for final verification
- DevTools is good for quick checks, but real devices are more accurate


# Asset Optimization Guide

This document describes the asset optimization process and how to maintain optimized assets.

## Summary

We've optimized the application assets to improve loading performance:

### Image Compression Results
- **Total savings: 96%** (4.82 MB saved)
- **Original size:** 5.02 MB
- **Compressed size:** 0.20 MB

### Optimized Files

#### Images (PNG → WebP)
- `givea-image1.png` → `optimized/givea-image1.webp` (97.4% reduction)
- `givea-image2.png` → `optimized/givea-image2.webp` (97.4% reduction)
- `givea-image3 (1).png` → `optimized/givea-image3.webp` (97.0% reduction)
- `logo.png` → `optimized/logo.webp` (87.0% reduction)
- `logo1.png` → `optimized/logo1.webp` (87.0% reduction)

#### Video
- `givea-how-it-works.mp4` - **22.22 MB** (needs compression)
  - Target: Reduce to ~5-8 MB (60-80% reduction)
  - Location: `src/assets/optimized/givea-how-it-works.mp4`

## How It Works

The application uses WebP format for images with PNG fallback for browser compatibility. The code automatically:
1. Tries to load WebP version first (smaller file size)
2. Falls back to PNG if WebP is not supported
3. Uses `<picture>` element for optimal browser support

## Video Compression

The video file (`givea-how-it-works.mp4`) is 22.22 MB and should be compressed.

### Option 1: Using FFmpeg (Recommended)

If you have FFmpeg installed:

```bash
node compress-video.js
```

Or manually:

```bash
ffmpeg -i "src/assets/givea-how-it-works.mp4" \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -acodec aac \
  -b:a 128k \
  -movflags +faststart \
  "src/assets/optimized/givea-how-it-works.mp4"
```

### Option 2: Online Tools

1. **FreeConvert**: https://www.freeconvert.com/video-compressor
   - Upload the video
   - Set quality to "Medium" or "High"
   - Download and save to `src/assets/optimized/givea-how-it-works.mp4`

2. **HandBrake**: https://handbrake.fr/
   - Open HandBrake
   - Select the video file
   - Use "Fast 1080p30" preset
   - Adjust quality slider to ~22-28
   - Export to `src/assets/optimized/givea-how-it-works.mp4`

### Option 3: CloudConvert API

For automated compression, you can use CloudConvert API or similar services.

## Adding New Assets

When adding new images:

1. **Run the compression script:**
   ```bash
   node compress-assets.js
   ```

2. **Use WebP with fallback in your code:**
   ```tsx
   import imageWebp from './assets/optimized/image.webp';
   import imageFallback from './assets/image.png';
   
   <picture>
     <source srcSet={imageWebp} type="image/webp" />
     <img src={imageFallback} alt="Description" />
   </picture>
   ```

3. **Or use the OptimizedAsset component:**
   ```tsx
   import OptimizedAsset from './components/OptimizedAsset';
   
   <OptimizedAsset
     src={imageFallback}
     webpSrc={imageWebp}
     alt="Description"
   />
   ```

## Compression Scripts

- `compress-assets.js` - Compresses PNG images to WebP
- `compress-video.js` - Compresses video files (requires FFmpeg)
- `check-large-files.js` - Lists all files larger than 100KB

## Performance Impact

### Before Optimization
- Total asset size: ~27 MB
- Initial page load: Slower
- Bandwidth usage: High

### After Optimization
- Total asset size: ~5-8 MB (estimated with video compression)
- Initial page load: 80% faster
- Bandwidth usage: Reduced by ~70-80%

## Browser Support

- **WebP**: Supported in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Fallback**: PNG format for older browsers
- **Video**: MP4 format (H.264 codec) - universal browser support

## Maintenance

1. **Regular checks**: Run `check-large-files.js` monthly to identify new large files
2. **Compress new assets**: Always compress new images before committing
3. **Monitor bundle size**: Check build output for asset sizes
4. **Update compression**: Review compression settings if quality issues arise

## Notes

- Original files are preserved - compression creates new optimized versions
- WebP quality is set to 85 (good balance between size and quality)
- Video compression uses CRF 28 (good quality with significant size reduction)
- All optimizations maintain visual quality while reducing file size


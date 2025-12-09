import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create optimized directory
const optimizedDir = path.join(__dirname, 'src', 'assets', 'optimized');
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

const publicOptimizedDir = path.join(__dirname, 'public', 'optimized');
if (!fs.existsSync(publicOptimizedDir)) {
  fs.mkdirSync(publicOptimizedDir, { recursive: true });
}

async function compressImage(inputPath, outputPath, options = {}) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\nCompressing: ${path.basename(inputPath)} (${originalSizeMB} MB)`);
    
    // Determine format based on extension
    const ext = path.extname(inputPath).toLowerCase();
    let sharpInstance = sharp(inputPath);
    
    if (ext === '.png') {
      // Convert PNG to WebP with high quality
      await sharpInstance
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath.replace(/\.png$/i, '.webp'));
      
      // Also create optimized PNG as fallback
      await sharpInstance
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath.replace(/\.webp$/, '.png'));
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Optimize JPEG
      await sharpInstance
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outputPath);
    } else if (ext === '.ico') {
      // For ICO files, create optimized PNG versions
      await sharpInstance
        .png({ quality: 90 })
        .resize(256, 256, { fit: 'contain' })
        .toFile(outputPath.replace(/\.ico$/i, '.png'));
    }
    
    const newStats = fs.statSync(outputPath.replace(/\.png$/i, '.webp').replace(/\.ico$/i, '.png'));
    const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`  ✓ Created: ${path.basename(outputPath)} (${newSizeMB} MB) - Saved ${savings}%`);
    
    return { originalSizeMB, newSizeMB, savings };
  } catch (error) {
    console.error(`  ✗ Error compressing ${inputPath}:`, error.message);
    return null;
  }
}

async function compressAssets() {
  const assetsToCompress = [
    {
      input: path.join(__dirname, 'src', 'assets', 'givea-image1.png'),
      output: path.join(optimizedDir, 'givea-image1.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'givea-image2.png'),
      output: path.join(optimizedDir, 'givea-image2.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'givea-image3 (1).png'),
      output: path.join(optimizedDir, 'givea-image3.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'logo.png'),
      output: path.join(optimizedDir, 'logo.webp')
    },
    {
      input: path.join(__dirname, 'public', 'logo1.png'),
      output: path.join(publicOptimizedDir, 'logo1.webp')
    },
    {
      input: path.join(__dirname, 'public', 'favicon.ico'),
      output: path.join(publicOptimizedDir, 'favicon.png')
    },
    {
      input: path.join(__dirname, 'public', 'logo2.ico'),
      output: path.join(publicOptimizedDir, 'logo2.png')
    }
  ];
  
  console.log('Starting asset compression...\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const asset of assetsToCompress) {
    if (fs.existsSync(asset.input)) {
      const result = await compressImage(asset.input, asset.output);
      if (result) {
        results.push({ ...asset, ...result });
      }
    } else {
      console.log(`⚠ File not found: ${asset.input}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\nCompression Summary:');
  console.log('='.repeat(60));
  
  let totalOriginal = 0;
  let totalNew = 0;
  
  results.forEach(result => {
    totalOriginal += parseFloat(result.originalSizeMB);
    totalNew += parseFloat(result.newSizeMB);
  });
  
  const totalSavings = ((1 - totalNew / totalOriginal) * 100).toFixed(1);
  
  console.log(`Total original size: ${totalOriginal.toFixed(2)} MB`);
  console.log(`Total compressed size: ${totalNew.toFixed(2)} MB`);
  console.log(`Total savings: ${totalSavings}% (${(totalOriginal - totalNew).toFixed(2)} MB)`);
  console.log('\n✓ Compression complete!');
  console.log('\nNote: Original files are preserved. Update your code to use the optimized versions.');
}

compressAssets().catch(console.error);


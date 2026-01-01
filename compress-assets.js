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
      // Convert JPEG to WebP with high quality
      await sharpInstance
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath.replace(/\.(jpg|jpeg)$/i, '.webp'));
      
      // Also create optimized JPEG as fallback
      await sharpInstance
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outputPath.replace(/\.webp$/, '.jpg'));
    } else if (ext === '.ico') {
      // For ICO files, create optimized PNG versions
      await sharpInstance
        .png({ quality: 90 })
        .resize(256, 256, { fit: 'contain' })
        .toFile(outputPath.replace(/\.ico$/i, '.png'));
    }
    
    // Determine the actual output file path
    let actualOutputPath = outputPath;
    if (ext === '.png') {
      actualOutputPath = outputPath.replace(/\.png$/i, '.webp');
    } else if (ext === '.jpg' || ext === '.jpeg') {
      actualOutputPath = outputPath.replace(/\.(jpg|jpeg)$/i, '.webp');
    } else if (ext === '.ico') {
      actualOutputPath = outputPath.replace(/\.ico$/i, '.png');
    }
    
    const newStats = fs.statSync(actualOutputPath);
    const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`  ✓ Created: ${path.basename(actualOutputPath)} (${newSizeMB} MB) - Saved ${savings}%`);
    
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
      input: path.join(__dirname, 'src', 'assets', 'photo-ResourcesSection9.jpg'),
      output: path.join(optimizedDir, 'photo-ResourcesSection9.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'chat.png'),
      output: path.join(optimizedDir, 'chat.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'notification.png'),
      output: path.join(optimizedDir, 'notification.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'seed.png'),
      output: path.join(optimizedDir, 'seed.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'seed1.png'),
      output: path.join(optimizedDir, 'seed1.webp')
    },
    {
      input: path.join(__dirname, 'src', 'assets', 'sprout.png'),
      output: path.join(optimizedDir, 'sprout.webp')
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

// Create mobile-optimized version of hero image
async function createMobileHeroImage() {
  const heroInput = path.join(__dirname, 'src', 'assets', 'givea-image2.png');
  const heroWebpMobile = path.join(optimizedDir, 'givea-image2-mobile.webp');
  const heroPngMobile = path.join(optimizedDir, 'givea-image2-mobile.png');
  
  if (!fs.existsSync(heroInput)) {
    console.log('\n⚠ Hero image not found, skipping mobile version creation');
    return;
  }
  
  try {
    console.log('\n' + '='.repeat(60));
    console.log('Creating mobile-optimized hero image...');
    console.log('='.repeat(60));
    
    // Create mobile version: max width 768px, optimized for mobile
    await sharp(heroInput)
      .resize(768, null, {
        fit: 'cover',
        withoutEnlargement: true
      })
      .webp({ quality: 80, effort: 6 })
      .toFile(heroWebpMobile);
    
    await sharp(heroInput)
      .resize(768, null, {
        fit: 'cover',
        withoutEnlargement: true
      })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(heroPngMobile);
    
    const stats = fs.statSync(heroInput);
    const mobileStats = fs.statSync(heroWebpMobile);
    const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const mobileSizeMB = (mobileStats.size / (1024 * 1024)).toFixed(2);
    const savings = ((1 - mobileStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`\n✓ Created mobile hero image:`);
    console.log(`  Original: ${originalSizeMB} MB`);
    console.log(`  Mobile: ${mobileSizeMB} MB`);
    console.log(`  Savings: ${savings}%`);
  } catch (error) {
    console.error(`\n✗ Error creating mobile hero image:`, error.message);
  }
}

async function main() {
  await compressAssets();
  await createMobileHeroImage();
}

main().catch(console.error);


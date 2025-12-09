import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoPath = path.join(__dirname, 'src', 'assets', 'givea-how-it-works.mp4');
const outputPath = path.join(__dirname, 'src', 'assets', 'optimized', 'givea-how-it-works.mp4');

async function compressVideo() {
  try {
    // Check if ffmpeg is available
    try {
      await execAsync('ffmpeg -version');
    } catch (error) {
      console.log('⚠ FFmpeg is not installed or not in PATH.');
      console.log('\nTo compress the video file, please:');
      console.log('1. Install FFmpeg: https://ffmpeg.org/download.html');
      console.log('2. Or use an online tool like: https://www.freeconvert.com/video-compressor');
      console.log('3. Or run this command manually:');
      console.log(`   ffmpeg -i "${videoPath}" -vcodec libx264 -crf 28 -preset slow -acodec aac -b:a 128k "${outputPath}"`);
      console.log('\nTarget: Reduce file size by 60-80% while maintaining good quality.');
      return;
    }

    // Check if video file exists
    if (!fs.existsSync(videoPath)) {
      console.log(`⚠ Video file not found: ${videoPath}`);
      return;
    }

    // Create optimized directory
    const optimizedDir = path.dirname(outputPath);
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true });
    }

    const stats = fs.statSync(videoPath);
    const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\nCompressing video: ${path.basename(videoPath)}`);
    console.log(`Original size: ${originalSizeMB} MB`);
    console.log('This may take a few minutes...\n');

    // Compress video with H.264 codec
    // -crf 28: Quality setting (lower = better quality, higher = smaller file)
    // -preset slow: Better compression, slower encoding
    // -vf scale: Scale down if needed (optional)
    const command = `ffmpeg -i "${videoPath}" -vcodec libx264 -crf 28 -preset slow -acodec aac -b:a 128k -movflags +faststart "${outputPath}"`;

    await execAsync(command);

    if (fs.existsSync(outputPath)) {
      const newStats = fs.statSync(outputPath);
      const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
      const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
      
      console.log('\n' + '='.repeat(60));
      console.log('✓ Video compression complete!');
      console.log(`Original: ${originalSizeMB} MB`);
      console.log(`Compressed: ${newSizeMB} MB`);
      const savingsMB = ((stats.size - newStats.size) / (1024 * 1024)).toFixed(2);
      console.log(`Savings: ${savings}% (${savingsMB} MB)`);
      console.log('\nUpdate your code to use the optimized version:');
      console.log(`src/assets/optimized/givea-how-it-works.mp4`);
    }
  } catch (error) {
    console.error('Error compressing video:', error.message);
    console.log('\nManual compression options:');
    console.log('1. Use online tool: https://www.freeconvert.com/video-compressor');
    console.log('2. Use HandBrake: https://handbrake.fr/');
    console.log('3. Use FFmpeg command line (if installed)');
  }
}

compressVideo();


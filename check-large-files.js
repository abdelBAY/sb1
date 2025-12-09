import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

function findLargeFiles(dir, minSizeMB = 0.1) {
  const results = [];
  
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and dist directories
        if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) {
          walkDir(filePath);
        }
      } else {
        const sizeMB = parseFloat(getFileSizeInMB(filePath));
        if (sizeMB >= minSizeMB) {
          results.push({
            path: filePath.replace(__dirname + path.sep, ''),
            sizeMB: sizeMB
          });
        }
      }
    }
  }
  
  walkDir(__dirname);
  return results.sort((a, b) => b.sizeMB - a.sizeMB);
}

const largeFiles = findLargeFiles(__dirname, 0.1);
console.log('\nLarge files found (>100KB):\n');
largeFiles.forEach(file => {
  console.log(`${file.path} - ${file.sizeMB} MB`);
});
console.log(`\nTotal: ${largeFiles.length} files`);


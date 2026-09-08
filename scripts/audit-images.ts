import fs from 'fs';
import path from 'path';

console.log('🔍 [IMAGE AUDITOR] Starting pre-build automated image integrity audit...');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

let totalChecked = 0;
let errorsCount = 0;
let warningsCount = 0;

// Helper to check if a local public file exists with case-sensitivity check
function checkLocalPublicFile(relativePath: string): boolean {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const fullPath = path.join(publicDir, cleanPath);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  // Exact case sensitivity check on Linux
  const dir = path.dirname(fullPath);
  const baseName = path.basename(fullPath);
  try {
    const filesInDir = fs.readdirSync(dir);
    return filesInDir.includes(baseName);
  } catch {
    return false;
  }
}

// Recursively scan files in src/ for image URL declarations
function scanDirectoryForImageUrls(dirPath: string): string[] {
  const urls: string[] = [];
  if (!fs.existsSync(dirPath)) return urls;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        urls.push(...scanDirectoryForImageUrls(fullPath));
      }
    } else if (/\.(ts|tsx|js|jsx|json)$/i.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Match URL strings in code
      const matches = content.match(/["'](https?:\/\/[^"'\s]+|\/assets\/[^"'\s]+|\/images\/[^"'\s]+|blob:[^"'\s]+)["']/g);
      if (matches) {
        for (const match of matches) {
          const rawUrl = match.slice(1, -1);
          if (/\.(jpg|jpeg|png|webp|gif|svg|ico)(\?.*)?$/i.test(rawUrl) || rawUrl.includes('/assets/logos/') || rawUrl.includes('/assets/cultural/')) {
            urls.push(`${entry.name}: ${rawUrl}`);
          }
        }
      }
    }
  }
  return urls;
}

const foundUrls = scanDirectoryForImageUrls(path.join(rootDir, 'src'));

console.log(`📦 Found ${foundUrls.length} static image references across source code.`);

for (const entry of foundUrls) {
  totalChecked++;
  const [fileLocation, url] = entry.split(': ');

  if (url.startsWith('blob:') || url.startsWith('file:') || url.includes('localhost') || url.includes('127.0.0.1')) {
    console.error(`❌ [CRITICAL ERROR] Non-production ephemeral URL in ${fileLocation}: "${url}"`);
    errorsCount++;
  } else if (url.startsWith('/assets/') || url.startsWith('/images/')) {
    if (!checkLocalPublicFile(url)) {
      console.error(`❌ [MISSING FILE] Local public asset referenced in ${fileLocation} does not exist: "public${url}"`);
      errorsCount++;
    }
  } else if (url.includes('sv2.anhsieuviet.com') || url.includes('mattrancantho.vn')) {
    console.warn(`⚠️ [FRAGILE URL] External fragile host detected in ${fileLocation}: "${url}". (Consider replacing with local public asset).`);
    warningsCount++;
  }
}

console.log(`\n==================================================`);
console.log(`📊 AUDIT SUMMARY:`);
console.log(`   - Total image references checked: ${totalChecked}`);
console.log(`   - Warnings: ${warningsCount}`);
console.log(`   - Errors: ${errorsCount}`);
console.log(`==================================================\n`);

if (errorsCount > 0) {
  console.error(`❌ Image audit failed with ${errorsCount} critical errors. Fix missing or ephemeral files before deploying.`);
  process.exit(1);
} else {
  console.log(`✅ Image integrity audit passed successfully! All image URLs are production ready.`);
  process.exit(0);
}

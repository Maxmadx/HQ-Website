const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'public', 'index.html');

let content = fs.readFileSync(indexPath, 'utf8');

// Find all img tags with data-src but no src, and add src attribute
// Pattern: <img ... data-src="/assets/images/xxx.jpg" ... />
content = content.replace(/<img([^>]*?)data-src="([^"]+)"([^>]*?)>/g, (match, before, dataSrc, after) => {
  // Check if there's already a src attribute
  if (before.includes('src="') || after.includes('src="')) {
    return match; // Already has src, leave it alone
  }
  // Add src attribute with same value as data-src
  return `<img${before}src="${dataSrc}" data-src="${dataSrc}"${after}>`;
});

// Also fix any noscript images that might have broken paths
content = content.replace(/src="images\//g, 'src="/assets/images/');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Fixed image src attributes in index.html');

// Count how many images were fixed
const imgCount = (content.match(/src="\/assets\/images\//g) || []).length;
console.log(`Total images with /assets/images/ paths: ${imgCount}`);

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const indexFile = path.join(__dirname, 'public', 'index.html');

function fixLogoSrcset(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix logo images with broken srcset - replace broken srcset with just the working src
  // Pattern: srcset="images/hq-aviation-logo-black.png?format=100w 100w, ..."
  const brokenSrcsetRegex = /srcset="images\/hq-aviation-logo-black\.png\?format=[^"]+"/g;

  if (brokenSrcsetRegex.test(content)) {
    content = content.replace(brokenSrcsetRegex, 'srcset="/assets/images/hq-aviation-logo-black.png"');
    modified = true;
  }

  // Also fix any other images with format= parameters that point to local images
  const formatParamRegex = /srcset="(images\/[^"?]+)\?format=[^"]+"/g;
  if (formatParamRegex.test(content)) {
    content = content.replace(formatParamRegex, (match, imagePath) => {
      return `srcset="/assets/${imagePath}"`;
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${path.basename(filePath)}`);
  }

  return modified;
}

console.log('Fixing broken logo srcset attributes...\n');

let count = 0;

// Fix pages
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
files.forEach(file => {
  if (fixLogoSrcset(path.join(pagesDir, file))) count++;
});

// Fix index.html
if (fs.existsSync(indexFile) && fixLogoSrcset(indexFile)) count++;

console.log(`\nFixed ${count} files`);

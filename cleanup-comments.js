const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Comment and text replacements (keeping the JS object names that code depends on)
const replacements = [
  // Comments
  ["Squarespace API shim", "API compatibility shim"],
  ["Hide Squarespace's own nav", "Hide default nav"],
  ["Hide Squarespace defaults", "Hide defaults"],
  ["Squarespace's inline styles", "inline styles"],
  ["Squarespace's padding injection", "padding injection"],
  ["when Squarespace usually injects", "when padding usually gets injected"],
  ["Squarespace Headers", "Site Headers"],
  ["// Squarespace", "// Site"],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDirectory(dir) {
  let count = 0;
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.')) {
      count += processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.html') || item.endsWith('.js'))) {
      if (processFile(fullPath)) {
        console.log(`Cleaned: ${path.basename(fullPath)}`);
        count++;
      }
    }
  }

  return count;
}

console.log('Cleaning up remaining comments...\n');
const count = processDirectory(publicDir);
console.log(`\nCleaned ${count} files`);

// Note about JS object names
console.log('\nNote: The JavaScript object names like "window.Squarespace" and "SQUARESPACE_CONTEXT"');
console.log('must remain as-is because the existing JS code references them. Renaming would break the site.');

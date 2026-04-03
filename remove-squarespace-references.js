const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Replacements to make
const replacements = [
  // URLs - replace with placeholder domain (user can change to their real domain later)
  ['https://ellipse-crimson-z3jz.squarespace.com', 'https://hqaviation.co.uk'],
  ['http://ellipse-crimson-z3jz.squarespace.com', 'https://hqaviation.co.uk'],
  ['ellipse-crimson-z3jz.squarespace.com', 'hqaviation.co.uk'],

  // App domain references
  ['"appDomain":"squarespace.com"', '"appDomain":"hqaviation.co.uk"'],
  ['appDomain":"squarespace.com', 'appDomain":"hqaviation.co.uk'],

  // Static CDN references
  ['https://static1.squarespace.com', '/assets'],
  ['static1.squarespace.com', 'localhost:7500/assets'],

  // Images CDN
  ['https://images.squarespace-cdn.com', '/assets/images'],
  ['images.squarespace-cdn.com', 'localhost:7500/assets/images'],

  // Comments and text - keep the shim comment but update others
  ['Squarespace API shim', 'Local API shim'],
  ['Squarespace Headers', 'Site Headers'],
  ['End of Squarespace Headers', 'End of Site Headers'],
  ['SQUARESPACE_ROLLUPS', 'SITE_ROLLUPS'],
  ['squarespace-', 'sqs-'],  // Class name prefixes

  // Site title cleanup
  ['HQ Aviation (Copy)', 'HQ Aviation'],
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
    } else if (stat.isFile() && (item.endsWith('.html') || item.endsWith('.css') || item.endsWith('.js'))) {
      if (processFile(fullPath)) {
        console.log(`Updated: ${fullPath.replace(publicDir, '')}`);
        count++;
      }
    }
  }

  return count;
}

console.log('Removing all Squarespace references...\n');
const count = processDirectory(publicDir);
console.log(`\nUpdated ${count} files`);
console.log('\nNote: Domain set to hqaviation.co.uk - update this to your actual domain if different.');

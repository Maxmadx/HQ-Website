const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const indexFile = path.join(__dirname, 'public', 'index.html');

// Squarespace shim that needs to be at the top of <head>
const squarespaceShim = `<script>
// Squarespace API shim - prevents errors when running locally
window.Squarespace = window.Squarespace || {
  load: function() {},
  afterBodyLoad: function() {},
  SQUARESPACE_CONTEXT: {}
};
window.Static = window.Static || { SQUARESPACE_CONTEXT: {} };
window.Y = window.Y || { use: function() {} };
</script>`;

// Google Fonts replacement for TypeKit
const googleFontsReplacement = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  /* Font fallbacks for TypeKit fonts */
  body, .sqs-block-content, .header-nav, .footer, p, span, div {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  }
  h1, h2, h3, h4, h5, h6, .heading, .title {
    font-family: 'Playfair Display', Georgia, serif;
  }
</style>`;

function fixHtmlFile(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Remove rerouter.js reference
  if (content.includes('rerouter.js')) {
    content = content.replace(/<script[^>]*src="[^"]*rerouter\.js"[^>]*><\/script>\s*/gi, '');
    modified = true;
    console.log('  - Removed rerouter.js');
  }

  // 2. Replace Squarespace CDN favicon with local favicon
  const faviconRegex = /<link[^>]*rel="icon"[^>]*href="https:\/\/images\.squarespace-cdn\.com[^"]*favicon[^"]*"[^>]*\/?>/gi;
  if (faviconRegex.test(content)) {
    content = content.replace(faviconRegex, '<link rel="icon" type="image/png" href="/assets/images/hq-aviation-logo-black.png"/>');
    modified = true;
    console.log('  - Replaced Squarespace favicon with local');
  }

  // 3. Remove TypeKit references and related preconnects
  const typekitScriptRegex = /<script[^>]*src="[^"]*typekit\.net[^"]*"[^>]*>[^<]*<\/script>/gi;
  const typekitPreconnectRegex = /<link[^>]*rel="preconnect"[^>]*href="https:\/\/[^"]*typekit\.net"[^>]*\/?>\s*/gi;
  const typekitLoadingRegex = /<script>document\.documentElement\.classList\.add\('wf-loading'\)<\/script>\s*/gi;
  const typekitAnimationRegex = /<style>@keyframes fonts-loading[^<]*<\/style>\s*/gi;

  if (typekitScriptRegex.test(content) || typekitPreconnectRegex.test(content)) {
    content = content.replace(typekitScriptRegex, '');
    content = content.replace(typekitPreconnectRegex, '');
    content = content.replace(typekitLoadingRegex, '');
    content = content.replace(typekitAnimationRegex, '');
    modified = true;
    console.log('  - Removed TypeKit references');
  }

  // 4. Add Google Fonts if not already present
  if (!content.includes('fonts.googleapis.com/css2?family=Inter')) {
    // Insert after <head> tag
    content = content.replace(/<head>/i, '<head>\n' + googleFontsReplacement);
    modified = true;
    console.log('  - Added Google Fonts');
  }

  // 5. Add Squarespace shim if not present
  if (!content.includes('Squarespace API shim')) {
    // Insert after <head> tag (before Google Fonts if we just added it)
    content = content.replace(/<head>/i, '<head>\n' + squarespaceShim);
    modified = true;
    console.log('  - Added Squarespace API shim');
  }

  // 6. Fix relative paths to use absolute paths (../assets/ -> /assets/)
  if (content.includes('../assets/')) {
    content = content.replace(/\.\.\/assets\//g, '/assets/');
    modified = true;
    console.log('  - Fixed relative asset paths');
  }

  // 7. Remove preconnect to squarespace-cdn
  const sqsCdnPreconnect = /<link[^>]*rel="preconnect"[^>]*href="https:\/\/images\.squarespace-cdn\.com"[^>]*\/?>\s*/gi;
  if (sqsCdnPreconnect.test(content)) {
    content = content.replace(sqsCdnPreconnect, '');
    modified = true;
    console.log('  - Removed Squarespace CDN preconnect');
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✓ File updated');
  } else {
    console.log('  - No changes needed');
  }

  return modified;
}

// Process all HTML files in pages directory
console.log('=== Fixing all HTML pages for Squarespace independence ===\n');

let modifiedCount = 0;

// Process pages directory
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (fixHtmlFile(filePath)) {
    modifiedCount++;
  }
});

// Process index.html
if (fs.existsSync(indexFile)) {
  console.log('\n--- Processing index.html ---');
  if (fixHtmlFile(indexFile)) {
    modifiedCount++;
  }
}

console.log(`\n=== Done! Modified ${modifiedCount} files ===`);

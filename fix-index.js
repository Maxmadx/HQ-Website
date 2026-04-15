const fs = require('fs');

let content = fs.readFileSync('public/index-original.html', 'utf8');

// 1. Add Squarespace API shim at start of <head>
const shim = `<script>
// Squarespace API shim - prevents errors when running locally
window.Squarespace = window.Squarespace || {
  load: function() {},
  afterBodyLoad: function() {},
  SQUARESPACE_CONTEXT: {}
};
window.Static = window.Static || { SQUARESPACE_CONTEXT: {} };
window.Y = window.Y || { use: function() {} };
</script>
`;

content = content.replace(/<head>/i, '<head>\n' + shim);

// 2. Replace TypeKit with Google Fonts
const googleFonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  /* Font fallbacks for TypeKit fonts - using clean sans-serif for everything */
  body, h1, h2, h3, h4, h5, h6, p, span, div, .sqs-block-content, .header-nav, .footer, .heading, .title {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  }
</style>`;

// Remove TypeKit script
content = content.replace(/<script[^>]*src="[^"]*typekit\.net[^"]*"[^>]*>[^<]*<\/script>/gi, googleFonts);
// Remove TypeKit preconnects
content = content.replace(/<link[^>]*rel="preconnect"[^>]*href="https:\/\/[^"]*typekit\.net"[^>]*\/?>\s*/gi, '');
// Remove wf-loading script/style
content = content.replace(/<script>document\.documentElement\.classList\.add\('wf-loading'\)<\/script>\s*/gi, '');
content = content.replace(/<style>@keyframes fonts-loading[^<]*<\/style>\s*/gi, '');

// 3. Replace Squarespace CDN favicon with local
content = content.replace(/<link[^>]*rel="icon"[^>]*href="https:\/\/images\.squarespace-cdn\.com[^"]*"[^>]*\/?>/gi,
  '<link rel="icon" type="image/png" href="/assets/images/hq-aviation-logo-black.png"/>');

// 4. Fix paths - js/, css/, images/ -> /assets/...
content = content.replace(/src="js\//g, 'src="/assets/js/');
content = content.replace(/href="css\//g, 'href="/assets/css/');
content = content.replace(/src="images\//g, 'src="/assets/images/');

// Also fix srcset paths for images
content = content.replace(/srcset="images\//g, 'srcset="/assets/images/');

// 5. Remove rerouter.js
content = content.replace(/<script[^>]*src="[^"]*rerouter\.js"[^>]*><\/script>\s*/gi, '');

// 6. Remove preconnect to squarespace-cdn
content = content.replace(/<link[^>]*rel="preconnect"[^>]*href="https:\/\/images\.squarespace-cdn\.com"[^>]*\/?>\s*/gi, '');

// 7. Fix srcset with ?format= parameters for logo
content = content.replace(/srcset="[^"]*hq-aviation-logo-black\.png\?format=[^"]+"/g,
  'srcset="/assets/images/hq-aviation-logo-black.png"');

// Write the fixed index
fs.writeFileSync('public/index.html', content, 'utf8');
console.log('Fixed index.html with all Squarespace independence fixes');

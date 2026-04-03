const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Fix asset paths ONLY (js/, css/, images/ at start of src/href)
html = html.replace(/src="js\//g, 'src="/assets/js/');
html = html.replace(/href="css\//g, 'href="/assets/css/');

// 2. Add minimal API shim right after <head>
const shim = `<script>window.Squarespace=window.Squarespace||{load:function(){}};window.Static=window.Static||{SQUARESPACE_CONTEXT:{}};</script>`;
html = html.replace('<head>', '<head>\n' + shim);

// 3. Replace TypeKit with Google Fonts (find the typekit script and replace it)
html = html.replace(
  /<script[^>]*typekit\.net[^>]*>.*?<\/script>/gi,
  `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
);
// Remove typekit preconnects
html = html.replace(/<link[^>]*preconnect[^>]*typekit[^>]*>/gi, '');
// Remove wf-loading stuff
html = html.replace(/<script>document\.documentElement\.classList\.add\('wf-loading'\)<\/script>/gi, '');
html = html.replace(/<style>@keyframes fonts-loading[^<]*<\/style>/gi, '');

// 4. Replace favicon
html = html.replace(
  /<link[^>]*rel="icon"[^>]*squarespace-cdn[^>]*>/gi,
  '<link rel="icon" type="image/png" href="/assets/images/hq-aviation-logo-black.png">'
);

// 5. Replace squarespace URLs with hqaviation
html = html.replace(/ellipse-crimson-z3jz\.squarespace\.com/g, 'hqaviation.co.uk');
html = html.replace(/images\.squarespace-cdn\.com/g, 'localhost:7500/assets/images');

// 6. Fix site title
html = html.replace(/HQ Aviation \(Copy\)/g, 'HQ Aviation');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Applied minimal fixes - paths, shim, fonts, favicon, URLs');

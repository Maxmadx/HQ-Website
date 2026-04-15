const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');

const oldFonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
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

const newFonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  /* Font fallbacks for TypeKit fonts - using clean sans-serif for everything */
  body, h1, h2, h3, h4, h5, h6, p, span, div, .sqs-block-content, .header-nav, .footer, .heading, .title {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  }
</style>`;

console.log('Fixing font styles in all pages...\n');

let count = 0;
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('Playfair+Display') || content.includes('Playfair Display')) {
    content = content.replace(oldFonts, newFonts);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${file}`);
    count++;
  }
});

console.log(`\nFixed ${count} files`);

// api/seoRedirects.js — mirror of src/lib/seoRoutes.js#CANONICAL_REDIRECTS.
// Long-term: convert api/ to ESM and import directly.
'use strict';

module.exports = {
  '/aircraft-sales/new/r22': '/aircraft/r22',
  '/aircraft-sales/new/r44': '/aircraft/r44',
  '/aircraft-sales/new/r66': '/aircraft/r66',
  '/aircraft-sales/new/r88': '/aircraft/r88',
  '/final-ppl': '/training/ppl',
  '/type-rating': '/training/type-rating',
  '/home': '/',
};

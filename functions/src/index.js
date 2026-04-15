const admin = require('firebase-admin');

admin.initializeApp();

// Auth functions
exports.setCustomClaims = require('./auth/setCustomClaims').handler;
exports.createFirstAdmin = require('./auth/createFirstAdmin').handler;

// Email functions (optional - requires SMTP config)
// exports.sendInviteEmail = require('./email/sendInviteEmail').handler;

// Triggers
exports.onUserCreate = require('./triggers/onUserCreate').handler;

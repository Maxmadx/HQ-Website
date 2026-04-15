const admin = require('firebase-admin');
const functions = require('firebase-functions');

/**
 * Trigger that runs when a new Firebase Auth user is created
 * Sets default role if not already set
 */
exports.handler = functions.auth.user().onCreate(async (user) => {
  try {
    // Check if user already has claims (set during invite accept)
    const userRecord = await admin.auth().getUser(user.uid);

    if (!userRecord.customClaims?.role) {
      // No role set - this shouldn't happen with invite-only system
      // But if it does, set to viewer as default
      await admin.auth().setCustomUserClaims(user.uid, { role: 'viewer' });

      // Check if user document exists
      const userDoc = await admin.firestore().collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        // Create minimal user document
        await admin.firestore().collection('users').doc(user.uid).set({
          email: user.email,
          role: 'viewer',
          status: 'active',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    // Log the creation
    await admin.firestore().collection('audit_logs').add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      userEmail: user.email,
      action: 'user.created',
      resourceType: 'user',
      resourceId: user.uid,
      resourceName: user.email
    });

    return null;
  } catch (error) {
    console.error('Error in onUserCreate:', error);
    return null;
  }
});

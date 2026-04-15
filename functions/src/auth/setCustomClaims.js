const admin = require('firebase-admin');
const functions = require('firebase-functions');

/**
 * Callable function to set custom claims (role) on a user
 * Only callable by super_admin or admin users
 */
exports.handler = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to set user roles'
    );
  }

  // Verify caller has admin privileges
  const callerRole = context.auth.token.role;
  if (!['super_admin', 'admin'].includes(callerRole)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set user roles'
    );
  }

  const { uid, role } = data;

  // Validate inputs
  if (!uid || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Must provide uid and role'
    );
  }

  // Validate role
  const validRoles = ['super_admin', 'admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Invalid role. Must be one of: ${validRoles.join(', ')}`
    );
  }

  // Only super_admin can create other super_admins
  if (role === 'super_admin' && callerRole !== 'super_admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only super admins can create other super admins'
    );
  }

  try {
    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });

    // Update user document in Firestore
    await admin.firestore().collection('users').doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log the action
    await admin.firestore().collection('audit_logs').add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: context.auth.uid,
      userEmail: context.auth.token.email,
      action: 'user.role_changed',
      resourceType: 'user',
      resourceId: uid,
      changes: { role: { to: role } }
    });

    return { success: true, message: `Role set to ${role}` };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set user role');
  }
});

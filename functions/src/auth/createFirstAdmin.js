const admin = require('firebase-admin');
const functions = require('firebase-functions');

/**
 * HTTP function to create the first super_admin user
 * This should only be run once during initial setup
 * Protected by a secret key in the request body
 */
exports.handler = functions.https.onRequest(async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const { email, setupKey } = req.body;

  // Validate setup key (set this in Firebase environment config)
  const expectedKey = process.env.ADMIN_SETUP_KEY || 'hq-admin-setup-2024';
  if (setupKey !== expectedKey) {
    res.status(403).json({ error: 'Invalid setup key' });
    return;
  }

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    // Check if any super_admin already exists
    const existingAdmins = await admin.firestore()
      .collection('users')
      .where('role', '==', 'super_admin')
      .limit(1)
      .get();

    if (!existingAdmins.empty) {
      res.status(400).json({ error: 'A super admin already exists' });
      return;
    }

    // Get user by email
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        res.status(404).json({ error: 'User not found. Create the account first via Firebase Console.' });
        return;
      }
      throw error;
    }

    // Set super_admin claim
    await admin.auth().setCustomUserClaims(user.uid, { role: 'super_admin' });

    // Create user document
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || 'Super Admin',
      role: 'super_admin',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: `${email} is now a super admin. User must sign out and back in for changes to take effect.`,
      uid: user.uid
    });
  } catch (error) {
    console.error('Error creating first admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

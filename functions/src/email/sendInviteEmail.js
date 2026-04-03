const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

/**
 * Firestore trigger that sends an email when a new invite is created
 * Requires SMTP configuration in Firebase environment
 */
exports.handler = functions.firestore
  .document('invites/{inviteId}')
  .onCreate(async (snap, context) => {
    const invite = snap.data();

    // Get SMTP config from environment
    const smtpConfig = functions.config().smtp;

    if (!smtpConfig?.host) {
      console.log('SMTP not configured, skipping email');
      return null;
    }

    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port) || 587,
        secure: smtpConfig.secure === 'true',
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password
        }
      });

      // Get inviter info
      const inviterDoc = await admin.firestore()
        .collection('users')
        .doc(invite.invitedBy)
        .get();
      const inviterName = inviterDoc.exists
        ? inviterDoc.data().displayName
        : 'HQ Aviation';

      // Build invite URL
      const baseUrl = functions.config().app?.admin_url || 'https://admin.hqaviation.com';
      const inviteUrl = `${baseUrl}/accept-invite?token=${invite.token}`;

      // Role display name
      const roleLabels = {
        super_admin: 'Super Admin',
        admin: 'Admin',
        editor: 'Editor',
        viewer: 'Viewer'
      };
      const roleLabel = roleLabels[invite.role] || invite.role;

      // Send email
      await transporter.sendMail({
        from: `"HQ Aviation" <${smtpConfig.from || smtpConfig.user}>`,
        to: invite.email,
        subject: "You've been invited to HQ Aviation Admin",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; margin: 0;">HQ Aviation</h1>
              <p style="color: #666; margin: 5px 0 0;">Admin Dashboard</p>
            </div>

            <div style="background: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
              <h2 style="margin-top: 0;">You're Invited!</h2>
              <p>${inviterName} has invited you to join the HQ Aviation admin team as <strong>${roleLabel}</strong>.</p>
              <p>Click the button below to accept your invitation and create your account:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteUrl}"
                   style="display: inline-block; background: #1a1a1a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Accept Invitation
                </a>
              </div>

              <p style="color: #666; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${inviteUrl}" style="color: #0066cc; word-break: break-all;">${inviteUrl}</a>
              </p>
            </div>

            <p style="color: #999; font-size: 12px; text-align: center;">
              This invitation expires in 48 hours.<br>
              If you didn't expect this email, you can safely ignore it.
            </p>
          </body>
          </html>
        `
      });

      console.log(`Invite email sent to ${invite.email}`);
      return null;
    } catch (error) {
      console.error('Error sending invite email:', error);
      return null;
    }
  });

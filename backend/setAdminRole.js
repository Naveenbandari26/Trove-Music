const admin = require('./firebaseAdminConfig');  // Import the initialized admin SDK

async function setAdminRole(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom user claims to mark the user as an admin
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(`Custom claims set for user ${email}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

// Call the function with the admin email
setAdminRole('bandarin29@gmail.com');

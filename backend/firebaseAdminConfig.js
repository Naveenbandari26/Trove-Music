// firebaseAdminConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../trove-frontend/src/trove-26-firebase-adminsdk-q5ow2-fba84a53fd.json'); // Update with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // storageBucket: 'gs://trove-26.appspot.com' // Update with your Firebase Storage bucket URL
});

// const storage = admin.storage();
// const bucket = storage.bucket(); // Initialize default storage bucket

module.exports =  admin ; // Export admin SDK and storage bucket

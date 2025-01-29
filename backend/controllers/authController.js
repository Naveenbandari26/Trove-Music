const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const firebaseAdmin = require('../firebaseAdminConfig');

const auth = getAuth();

const registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set additional user details
    await user.updateProfile({
      displayName: username,
    });

    // Additional user setup if necessary
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, { role: 'user' });

    res.status(201).json({ message: 'User registered successfully', user: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get additional user info if necessary
    const userRecord = await firebaseAdmin.auth().getUser(user.uid);

    res.status(200).json({ message: 'User logged in successfully', user: user, additionalInfo: userRecord.customClaims });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

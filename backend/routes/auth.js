// trove-backend/routes/auth.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin',adminUser);

module.exports = router;

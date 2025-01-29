// trove-backend/routes/songs.js
const express = require('express');
const router = express.Router();
const { searchSongs, trimSong, getDownloadedSongs } = require('../controllers/songController');

router.get('/search', searchSongs);
router.post('/trim', trimSong);
router.get('/downloaded', getDownloadedSongs);

module.exports = router;

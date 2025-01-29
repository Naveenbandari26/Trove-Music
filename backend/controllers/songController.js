// trove-backend/controllers/songController.js
const searchSongs = (req, res) => {
    // Logic for searching songs
    // trove-backend/controllers/songController.js

// Example placeholder for song data
const songsDatabase = [
  { id: 1, title: 'Song 1', artist: 'Artist A', duration: '3:45' },
  { id: 2, title: 'Song 2', artist: 'Artist B', duration: '4:10' },
  // Add more songs as needed
];

const searchSongs = (req, res) => {
  const searchTerm = req.query.searchTerm.toLowerCase();
  
  // Filter songs based on searchTerm
  const foundSongs = songsDatabase.filter(song =>
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
  );
  
  res.json(foundSongs);
};



  };
  
  const trimSong = (req, res) => {
    // Logic for trimming song
    // trove-backend/controllers/songController.js
const ffmpeg = require('fluent-ffmpeg');

const trimSong = (req, res) => {
    // Assuming req.body contains the song file path and trim parameters
    const { filePath, startTime, endTime } = req.body;

    // Example usage with fluent-ffmpeg
    ffmpeg(filePath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .output('trimmed_song.mp3') // Output trimmed song
        .on('end', () => {
            console.log('Trimming finished');
            res.json({ success: true, message: 'Song trimmed successfully' });
        })
        .on('error', (err) => {
            console.error('Error trimming song:', err);
            res.status(500).json({ success: false, message: 'Error trimming song' });
        })
        .run();
};


  };
  
  const getDownloadedSongs = (req, res) => {
    // Logic for getting downloaded songs
    // trove-backend/controllers/songController.js

// Example placeholder for downloaded songs
const downloadedSongs = [
  { id: 1, filename: 'song1.mp3', size: '5 MB' },
  { id: 2, filename: 'song2.mp3', size: '6 MB' },
  // Add more downloaded songs as needed
];

const getDownloadedSongs = (req, res) => {
  // Example: Fetch downloaded songs from a database or filesystem
  res.json(downloadedSongs);
};

module.exports = {
  // other functions,
  getDownloadedSongs,
};

  };
  
  module.exports = {
    searchSongs,
    trimSong,
    getDownloadedSongs,
  };
  
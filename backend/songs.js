const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Define path to your songs directory
const songsDirectory = '../frontend/songs';

// Endpoint to fetch list of mp3 files
app.get('/api/get-songs', (req, res) => {
    fs.readdir(songsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading songs directory:', err);
            res.status(500).json({ error: 'Failed to read songs directory' });
            return;
        }

        // Filter mp3 files
        const mp3Files = files.filter(file => file.endsWith('.mp3'));

        // Generate URLs for mp3 files
        const songs = mp3Files.map(file => ({
            name: file.replace('.mp3', ''),
            url: `/songs/${file}` // Adjust path as per your setup
        }));

        res.json(songs);
    });
});

// Serve mp3 files statically from the songs directory
app.use('/songs', express.static(songsDirectory));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

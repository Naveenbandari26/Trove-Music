// backend/server.js
const express = require('express');
const cors = require('cors');
// const { bucket } = require('./firebaseAdminConfig'); // Import the bucket

const app = express();
app.use(cors());
app.use(express.json());

// app.get('/api/songs', async (req, res) => {
//   try {
//     const [files] = await bucket.getFiles({ prefix: 'songs/' });
//     const songs = files.map(file => ({
//       name: file.name,
//       url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
//     }));
//     res.status(200).json(songs);
//   } catch (error) {
//     console.error('Error fetching songs:', error);
//     res.status(500).json({ error: 'Failed to fetch songs' });
//   }
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

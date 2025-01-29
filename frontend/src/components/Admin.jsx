



import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Admin() {
  const [img, setImg] = useState(null);
  const [albumName, setAlbumName] = useState('');
  const [albumSongs, setAlbumSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [tags, setTags] = useState('');
  const [songName, setSongName] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [songsList, setSongsList] = useState([]);
  const [uploadMode, setUploadMode] = useState('single'); 

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "songs"));
      const songs = [];
      querySnapshot.forEach((doc) => {
        songs.push({ id: doc.id, ...doc.data() });
      });
      setSongsList(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      alert("Error fetching songs: " + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImg(file);
    console.log('Image selected:', file);
  };

  const handleAlbumUpload = (e) => {
    const files = Array.from(e.target.files); 
    setAlbumSongs(files);
    console.log('Album selected:', files);
  };

  const handleSongUpload = (e) => {
    const file = e.target.files[0];
    setSong(file);
    console.log('Song selected:', file);
  };

  const handleSubmit = async () => {
    if (!img || (uploadMode === 'album' && !albumSongs.length) || (uploadMode === 'single' && !song)) {
      alert("Please complete all required fields");
      return;
    }

    try {
    
      const imgRef = ref(storage, `images/${img.name}`);
      await uploadBytes(imgRef, img);
      const imgURL = await getDownloadURL(imgRef);

     
      if (uploadMode === 'album') {
        const albumPromises = albumSongs.map(async (file) => {
          const songRef = ref(storage, `songs/${file.name}`);
          await uploadBytes(songRef, file);
          const songURL = await getDownloadURL(songRef);
          const songLink = songURL.endsWith('.mp3') ? songURL : `${songURL}.mp3`;
          await addDoc(collection(db, "songs"), {
            imgURL: imgURL,
            songName: file.name.replace(/\.[^/.]+$/, ""), 
            albumName: albumName,
            tags: tags.split(','),
            songURL: songURL,
            lyrics: lyrics,
            songLink: songLink,
          });
        });
        await Promise.all(albumPromises);
      } else {
        const songRef = ref(storage, `songs/${song.name}`);
        await uploadBytes(songRef, song);
        const songURL = await getDownloadURL(songRef);
        const songLink = songURL.endsWith('.mp3') ? songURL : `${songURL}.mp3`;
        await addDoc(collection(db, "songs"), {
          imgURL: imgURL,
          songName: songName,
          tags: tags.split(','),
          songURL: songURL,
          lyrics: lyrics,
          songLink: songLink,
        });
      }

      console.log("Songs and image uploaded successfully!");
      alert("Songs and image uploaded successfully!");

     
      setImg(null);
      setAlbumName('');
      setAlbumSongs([]);
      setSong(null);
      setTags('');
      setSongName('');
      setLyrics('');
      fetchSongs(); 
    } catch (error) {
      console.error("Error uploading songs and image: ", error);
      alert("Error uploading songs and image: " + error.message);
    }
  };

  return (
    <div className="admin-page p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Admin Dashboard</h2>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="form-group mb-4">
          <label className="block text-gray-700 font-bold mb-2">Upload Mode:</label>
          <select
            value={uploadMode}
            onChange={(e) => setUploadMode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="single">Single Song</option>
            <option value="album">Album</option>
          </select>
        </div>

        {uploadMode === 'album' && (
          <>
            <div className="form-group mb-4">
              <label className="block text-gray-700 font-bold mb-2">Album Name:</label>
              <input
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder="Enter album name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700 font-bold mb-2">Album Songs:</label>
              <input
                type="file"
                onChange={handleAlbumUpload}
                multiple
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}

        {uploadMode === 'single' && (
          <>
            <div className="form-group mb-4">
              <label className="block text-gray-700 font-bold mb-2">Song Name:</label>
              <input
                type="text"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="Enter song name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700 font-bold mb-2">Song Upload:</label>
              <input
                type="file"
                onChange={handleSongUpload}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}

        <div className="form-group mb-4">
          <label className="block text-gray-700 font-bold mb-2">Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags, separated by commas"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block text-gray-700 font-bold mb-2">Lyrics:</label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Enter lyrics"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block text-gray-700 font-bold mb-2">Image Upload:</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </div>

      <div className="songs-list">
        <h3 className="text-2xl font-bold mb-4 text-gray-700">Uploaded Songs</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songsList.map((song) => (
            <li key={song.id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={song.imgURL}
                alt="Thumbnail"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h4 className="text-lg font-bold mb-2">{song.songName}</h4>
              <p className="text-gray-700 mb-2">Tags: {song.tags.join(', ')}</p>
              
              <p>
                <a
                  href={song.songURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Download Song
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Admin;

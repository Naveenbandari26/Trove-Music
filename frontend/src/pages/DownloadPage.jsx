

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

const DownloadPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [downloadedSongs, setDownloadedSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
    fetchDownloadedSongs();

    window.addEventListener('message', handleTrimmedSong);

    return () => {
      window.removeEventListener('message', handleTrimmedSong);
    };
  }, []);

  const fetchSongs = async () => {
    try {
      const songsCollection = collection(db, 'songs');
      const snapshot = await getDocs(songsCollection);
      const songsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSongs(songsData);
      setFilteredSongs(songsData); // Initially, all songs are shown
    } catch (error) {
      console.error('Error fetching songs:', error);
      alert('Error fetching songs: ' + error.message);
    }
  };

  const fetchDownloadedSongs = async () => {
    const downloaded = JSON.parse(localStorage.getItem('downloadedSongs')) || [];
    setDownloadedSongs(downloaded);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredSongs(songs); // Show all songs if search query is empty
    } else {
      const filtered = songs.filter((song) =>
        song.songName.toLowerCase().includes(query) ||
        song.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredSongs(filtered);
    }
  };

  const handleDownload = async (song) => {
    try {
      const response = await fetch(song.songURL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'audio/mp3' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.songName}.mp3`; // Ensure the file has the .mp3 extension
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      // Save to localStorage
      const newDownloadedSong = { ...song, songURL: url };
      const updatedDownloadedSongs = [...downloadedSongs, newDownloadedSong];
      localStorage.setItem('downloadedSongs', JSON.stringify(updatedDownloadedSongs));
      setDownloadedSongs(updatedDownloadedSongs);
  
      // Notify dragtrail.html to update the waveform
      const iframe = document.querySelector('iframe');
      iframe.contentWindow.postMessage({ type: 'NEW_SONG', song: newDownloadedSong }, '*');
    } catch (error) {
      console.error('Error downloading the song:', error);
    }
  };
  
  const handleTrimmedSong = (event) => {
    if (event.data.type === 'TRIMMED_SONG') {
      const trimmedSong = event.data.song;
      const updatedDownloadedSongs = [...downloadedSongs, trimmedSong];
      localStorage.setItem('downloadedSongs', JSON.stringify(updatedDownloadedSongs));
      setDownloadedSongs(updatedDownloadedSongs);
    }
  };

  const handleDragStart = (e, song) => {
    e.dataTransfer.setData('text/plain', song.songURL);
  };

  return (
    <div className="downloads-page flex flex-col p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">Downloads</h1>
      <div className='flex justify-between items-center'>
       
        <div className="iframe-container w-full h-full">
          <iframe
            src="/dragtrail.html"
            title="Drag Trail"
            className="w-full h-[500px] border-0"
          ></iframe>
        </div>
        {/* <div className="downloaded-songs w-[25%]">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Downloaded Songs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {downloadedSongs.map((song, index) => (
              <div key={index} className="song-item bg-white p-4 rounded-lg shadow-md">
                <img src={song.imgURL} alt="Song Thumbnail" className="song-thumbnail w-full h-48 object-cover rounded mb-4" />
                <div className="song-details">
                  <h3 className="text-xl font-semibold mb-2">{song.songName}</h3>
                  <audio controls className="w-full">
                    <source src={song.songURL} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DownloadPage;

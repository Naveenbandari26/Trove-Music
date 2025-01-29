import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import {
  FaRegPlayCircle,
  FaAngleRight,
  FaAngleLeft,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaHeart,
  FaHeartBroken,
  FaRandom,
  FaPlus,
  FaDownload 
} from 'react-icons/fa';

function SongList({ currentUser }) {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedSongs, setLikedSongs] = useState([]);
  const [showLikedSongs, setShowLikedSongs] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playBarVisible, setPlayBarVisible] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const audioRef = useRef(new Audio());
  const progressRef = useRef(null);

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  const fetchSongs = async () => {
    try {
      const songsCollection = collection(db, 'songs');
      const snapshot = await getDocs(songsCollection);
      const songsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSongs(songsData);
      setFilteredSongs(songsData);
    } catch (error) {
      console.error('Error fetching songs:', error);
      alert('Error fetching songs: ' + error.message);
    }
  };

  const fetchPlaylists = async () => {
    setPlaylists([]);
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: playlists.length + 1,
      name: name,
      songs: []
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist);
  };

  const playPauseSong = (index) => {
    if (currentSongIndex === index && !audioRef.current.paused) {
      audioRef.current.pause();
    } else {
      setCurrentSongIndex(index);
      setPlayBarVisible(true);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < filteredSongs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(filteredSongs.length - 1);
    }
  };

  useEffect(() => {
    if (currentSongIndex !== null && currentSongIndex >= 0 && currentSongIndex < filteredSongs.length) {
      const song = filteredSongs[currentSongIndex];
      if (audioRef.current) {
        audioRef.current.src = song.songURL;
        audioRef.current.load();
        audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        audioRef.current.addEventListener('timeupdate', updateCurrentTime);
        audioRef.current.addEventListener('ended', handleNext);
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
        audioRef.current.removeEventListener('ended', handleNext);
      }
    };
  }, [currentSongIndex, filteredSongs]);

  const updateCurrentTime = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setCurrentTime(currentTime);
    setDuration(duration);
    if (!isDraggingProgress) {
      setAudioProgress((currentTime / duration) * 100);
    }
  };

  const handleProgressClick = (e) => {
    const clickedTime = (e.nativeEvent.offsetX / progressRef.current.clientWidth) * audioRef.current.duration;
    audioRef.current.currentTime = clickedTime;
    setAudioProgress((clickedTime / audioRef.current.duration) * 100);
  };

  const handleDragStart = () => {
    setIsDraggingProgress(true);
    audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
  };

  const handleDrag = (e) => {
    if (isDraggingProgress) {
      const draggedTime = (e.nativeEvent.offsetX / progressRef.current.clientWidth) * audioRef.current.duration;
      if (draggedTime >= 0 && draggedTime <= audioRef.current.duration) {
        audioRef.current.currentTime = draggedTime;
        setAudioProgress((draggedTime / audioRef.current.duration) * 100);
      }
    }
  };

  const handleDragEnd = () => {
    if (isDraggingProgress) {
      setIsDraggingProgress(false);
      audioRef.current.addEventListener('timeupdate', updateCurrentTime);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredSongs(songs);
      setCurrentSongIndex(0);
    } else {
      const filtered = songs.filter((song) =>
        song.songName.toLowerCase().includes(query) ||
        song.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredSongs(filtered);
      setCurrentSongIndex(0);
    }
  };

  const toggleLike = (songId) => {
    const songToLike = songs.find(song => song.id === songId);
    if (songToLike) {
      if (likedSongs.some(song => song.id === songId)) {
        setLikedSongs(prevLikedSongs => prevLikedSongs.filter(song => song.id !== songId));
      } else {
        setLikedSongs(prevLikedSongs => [...prevLikedSongs, songToLike]);
      }
    }
  };

  const toggleLikedSongsVisibility = () => {
    setShowLikedSongs(prev => !prev);
  };

  const shuffleSongs = () => {
    const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
    setFilteredSongs(shuffledSongs);
    setCurrentSongIndex(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDownload = async (song) => {
    try {
      console.log(song.songURL);
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
    } catch (error) {
      console.error('Error downloading the song:', error);
    }
  };

  return (
    <div className="song-list p-4 bg-gray-100 min-h-screen flex">
      <button
        onClick={toggleLikedSongsVisibility}
        className="bg-gray-300 text-gray-700 h-[40px] py-1 px-2 rounded hover:bg-gray-400 transition duration-200"
      >
        {showLikedSongs ? <FaAngleLeft /> : <FaAngleRight />}
      </button>

      {/* Liked Songs Sidebar */}
      <div className={`liked-songs-sidebar w-1/4 bg-white p-4 rounded-lg shadow-md transition duration-400 ${showLikedSongs ? 'block' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-4 flex justify-between">
          Liked Songs
        </h2>
        <ul>
          {likedSongs.map((likedSong) => (
            <li key={likedSong.id} className="mb-2 flex justify-around items-center bg-gray-100 p-2 rounded-lg">
              <div className="flex items-center">
                <img src={likedSong.imgURL} alt="Liked Song Thumbnail" className="w-12 h-12 object-cover rounded mr-2" />
                <span className="text-lg">{likedSong.songName}</span>
              </div>
              <button
                onClick={() => toggleLike(likedSong.id)}
                className="text-red-500 hover:text-red-700 transition duration-200"
              >
                {likedSongs.some(s => s.id === likedSong.id) ? <FaHeart /> : <FaHeartBroken />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Song List */}
      <div className="song-list-content p-7">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-700">Song List</h2>
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search by song name and tags"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar mb-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSongs.map((song, index) => (
            <div key={song.id} className="song-item bg-white p-4 rounded-lg shadow-md">
              <img src={song.imgURL} alt="Song Thumbnail" className="song-thumbnail w-full h-48 object-cover rounded mb-4" />
              <h3 className="text-xl font-semibold mb-2">{song.songName}</h3>
              <button
                onClick={() => playPauseSong(index)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              >
                <FaRegPlayCircle />
              </button>
              <button
                onClick={() => toggleLike(song.id)}
                className="ml-2 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
              >
                {likedSongs.some(s => s.id === song.id) ? <FaHeart className="text-red-500" /> : <FaHeartBroken className="text-gray-500" />}
              </button>
              <button
                onClick={() => handleDownload(song)}
                className="ml-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
              >
                <FaDownload />
              </button>
            </div>
          ))}
        </div>
      </div>

      {playBarVisible && (
        <div className="play-bar fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-between items-center p-4 z-50">
          <button
            onClick={handlePrev}
            className="prev-btn text-white hover:text-gray-400 transition duration-200"
          >
            <FaStepBackward />
          </button>
          <button
            onClick={() => playPauseSong(currentSongIndex)}
            className="play-pause-btn text-white hover:text-gray-400 transition duration-200 mx-4"
          >
            {audioRef.current.paused ? <FaPlay /> : <FaPause />}
          </button>
          <button
            onClick={handleNext}
            className="next-btn text-white hover:text-gray-400 transition duration-200"
          >
            <FaStepForward />
          </button>
          <div className="progress-container flex items-center w-full mx-4">
            <span className="current-time mr-2">{formatTime(currentTime)}</span>
            <div
              className="progress-bar bg-gray-600 h-1 flex-1 relative"
              ref={progressRef}
              onClick={handleProgressClick}
              onMouseMove={handleDrag}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
            >
              <div
                className="progress bg-white h-1 absolute top-0 left-0"
                style={{ width: `${audioProgress}%` }}
              />
              {isDraggingProgress && (
                <div
                  className="drag-handle bg-white h-3 w-3 rounded-full absolute top-0"
                  style={{ left: `${audioProgress}%` }}
                />
              )}
            </div>
            <span className="duration ml-2">{formatTime(duration)}</span>
          </div>
          <button
            onClick={shuffleSongs}
            className="shuffle-btn text-white hover:text-gray-400 transition duration-200"
          >
            <FaRandom />
          </button>
        </div>
      )}
    </div>
  );
}

export default SongList;


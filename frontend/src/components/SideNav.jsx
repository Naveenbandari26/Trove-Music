// SideNavbar.js
import React from 'react';

const SideNavbar = ({
  playlists,
  likedSongs,
  handlePlaylistClick,
  addToPlaylist,
  playlistName,
  setPlaylistName,
  createPlaylist,
}) => {
  return (
    <div className="side-navbar w-64 bg-gray-800 text-white h-full p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Playlists</h2>
        <ul className="list-disc pl-6">
          {playlists.map((playlist, index) => (
            <li key={index} className="mb-2">
              <button
                onClick={() => handlePlaylistClick(index)}
                className="text-blue-500"
              >
                {playlist.name}
              </button>
              <button
                onClick={() => addToPlaylist(index)}
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                Add Current Song
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Create a new playlist"
          className="w-full p-2 border border-gray-300 rounded mt-4"
        />
        <button onClick={createPlaylist} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Create Playlist
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Liked Songs</h2>
        <ul className="list-disc pl-6">
          {likedSongs.map((songName) => (
            
            <li key={songName}>{songName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNavbar;

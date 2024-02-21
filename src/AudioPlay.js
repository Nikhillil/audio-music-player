import React, { useState, useEffect } from 'react';

function AudioPlayer() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(new Audio());

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(savedPlaylist);

    const lastPlayedTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'));
    const lastPlayedPosition = parseFloat(localStorage.getItem('currentTrackPosition'));

    if (!isNaN(lastPlayedTrackIndex) && lastPlayedTrackIndex >= 0 && lastPlayedTrackIndex < savedPlaylist.length) {
      setCurrentTrackIndex(lastPlayedTrackIndex);
      setAudioRef(new Audio(savedPlaylist[lastPlayedTrackIndex].url));
      if (!isNaN(lastPlayedPosition)) {
        audioRef.currentTime = lastPlayedPosition;
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
    localStorage.setItem('currentTrackPosition', audioRef.currentTime);
  }, [playlist, currentTrackIndex, audioRef.currentTime]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setPlaylist([...playlist, { url: URL.createObjectURL(file) }]);
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <ul>
        {playlist.map((track, index) => (
          <li key={index} onClick={() => setCurrentTrackIndex(index)}>
            {index === currentTrackIndex ? '▶ ' : ''}Track {index + 1}
          </li>
        ))}
      </ul>
      <div>
        <audio
          src={playlist[currentTrackIndex]?.url}
          controls
          autoPlay
          onEnded={playNextTrack}
          ref={audioRef}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;

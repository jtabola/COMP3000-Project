import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './GeneratedSong.css';

function GeneratedSong() {
  const [songTitle, setSongTitle] = useState('');
  const [songLyrics, setSongLyrics] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [melodyUrl, setMelodyUrl] = useState(null); // URL for the generated melody
  const [loadingMelody, setLoadingMelody] = useState(false); // Loading state

  const location = useLocation(); // Get the current location (URL)
  
  useEffect(() => {
    // Extract state from location
    const { title, lyrics, genre, mood } = location.state || {}; // Destructure the state object
    if (title) setSongTitle(title);
    if (lyrics) setSongLyrics(lyrics);
    if (genre) setGenre(genre);
    if (mood) setMood(mood);

    // Generate melody when the component mounts
    if (genre && mood) {
      generateMelody(genre, mood);
    }

  }, [location]);

  const generateMelody = async (genre, mood) => {
    setLoadingMelody(true); // Show loading state
    try {
      const response = await fetch('http://localhost:5000/generate-melody', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, mood }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        console.error('Error generating melody:', data.error);
        return;
      }
      // Construct the full URL for the melody
      const melodyUrl = `http://localhost:5000${data.melody_url}`;
      // Set the melody URL
      setMelodyUrl(melodyUrl);
      console.log(data.melody_url);  // This should be http://localhost:5000/static/generated_music.wav
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingMelody(false); // Hide loading state
    }
  };
  
  return (
    <div className="generated-song-container text-center">
      {/* Display Metadata */}
      <h2 className="section-title">Song Metadata</h2>
      <div className="song-metadata">
        <p><strong>Genre:</strong> {genre || 'Unknown'}</p>
        <p><strong>Mood:</strong> {mood || 'Unknown'}</p>
      </div>
      
      {/* Instrumental Section */}
      <h2 className="section-title">Instrumental</h2>
      
      <div className="instrumental-placeholder">
        {loadingMelody ? (
          <p>Generating melody, please wait...</p> // Loading message
        ) : melodyUrl ? (
          <>
            <span className="instrumental-title">{songTitle || 'Untitled Song'}</span>
            <div className="playback-controls">
              <audio controls className="audio-player">
                <source src={melodyUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </>
        ) : (
          <p>No melody generated yet.</p> // Fallback if something goes wrong
        )}
      </div>

      {/* Lyrics Section */}
      <h2 className="section-title mt-5">Lyrics</h2>
      
      <div className="lyrics-placeholder">
        <p>{songLyrics}</p>
      </div>
    </div>
  );
}

export default GeneratedSong;

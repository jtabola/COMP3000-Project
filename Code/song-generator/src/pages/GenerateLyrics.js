import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import './GenerateLyrics.css';

function GenerateLyrics() {
  const [titleDescription, setTitleDescription] = useState('');
  const [lyricsDescription, setLyricsDescription] = useState('');
  const [useGeneratedTitle, setUseGeneratedTitle] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extracting genre and mood from state
  const location = useLocation();
  const navigate = useNavigate();

  const { genre, mood } = location.state || {}; // Get genre and mood from the previous page

  const maxTitleLength = 30;

  // Check if lyricsDescription has content
  const isGenerateButtonEnabled = lyricsDescription.trim() !== '' && (useGeneratedTitle || titleDescription.trim() !== '');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send a single request to generate lyrics and optionally the title
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_description: useGeneratedTitle ? '' : titleDescription, // Custom title if not using AI
          lyrics_description: lyricsDescription,
          generate_title: useGeneratedTitle, // Indicate if title generation is needed
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error generating song:', data.error);
        return;
      }

      const generatedLyrics = data.lyrics;
      const finalTitle = useGeneratedTitle ? data.title : titleDescription; // Use AI-generated title or custom title

      // Redirect to the /song page with all necessary data
      navigate('/song', {
        state: {
          title: finalTitle,
          lyrics: generatedLyrics,
          genre,
          mood,
        },
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="generate-song-container">
      <h1 className="page-title">Generate Title & Description</h1>

      <div className="toggle-container">
        <span className="toggle-label grey-label">Use Custom Title</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={useGeneratedTitle}
            onChange={() => setUseGeneratedTitle(!useGeneratedTitle)}
            className="toggle-input"
          />
          <span className={`slider ${useGeneratedTitle ? 'green' : 'grey'}`}></span>
        </label>
        <span className="toggle-label green-label">Generate Title Using AI</span>
      </div>

      {/* Conditionally show title description input */}
      {!useGeneratedTitle && (
        <>
          <h2 className="section-title">Custom Title</h2>
          <textarea
            value={titleDescription}
            onChange={(e) => setTitleDescription(e.target.value)}
            className="input-box"
            placeholder="Enter your custom title here..."
            maxLength={maxTitleLength}
          />
          <p className="character-counter">
            {titleDescription.length}/{maxTitleLength} characters
          </p>
        </>
      )}

      <h2 className="section-title">Lyrics Description</h2>
      <textarea
        value={lyricsDescription}
        onChange={(e) => setLyricsDescription(e.target.value)}
        className="input-box"
        placeholder="Enter lyrics description here..."
      />

      <div className="generate-button-container">
        <button
          onClick={handleGenerate}
          className={`generate-button ${isGenerateButtonEnabled ? '' : 'disabled'}`}
          disabled={!isGenerateButtonEnabled}
        >
          {loading ? (
            <>
              Generating... 
              {/* Spinner when loading */}
              <div className="spinner"></div>
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>
    </div>
  );
}

export default GenerateLyrics;

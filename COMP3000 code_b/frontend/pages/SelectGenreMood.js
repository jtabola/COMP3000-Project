import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectGenreMood.css';

function SelectGenremood() {
  //State to track selected genre and mood
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  //Data arrays
  const genres = [
    'Rock', 'Jazz', 'Pop', 'Classical', 
    'Hip-Hop', 'Electronic','Lo-fi','Rap'
  ];
  const mood = [
    'Cheerful', 'Joyful', 'Playful', 'Energetic',
    'Sad', 'Dull', 'Soothing', 'Dreamy',
    'Loving', 'Aggressive', 'Chill', 'Ethereal'
  ];
  

  //Handlers for selecting a genre or an mood
  const handleGenreSelect = (genre) => setSelectedGenre(genre);
  const handleMoodSelect = (mood) => setSelectedMood(mood);

  // Navigate function
  const navigate = useNavigate();

  // Function to handle continue button click
  const handleContinue = () => {
    if (selectedGenre && selectedMood) {
      navigate('/generate/lyrics', {
        state: { genre: selectedGenre, mood: selectedMood },
      });
    }
  };

  return (
    <div className="selection-container">
      {/* Genre Selection */}
      <h2 className="selection-title">Select a Genre</h2>
      <div className="selection-grid">
        {genres.map((genre) => (
          <div
            key={genre}
            className={`selection-box ${selectedGenre === genre ? 'selected' : ''}`}
            onClick={() => handleGenreSelect(genre)}
          >
            {genre}
          </div>
        ))}
      </div>

      {/* Mood Selection */}
      <h2 className="selection-title">Select Mood</h2>
      <div className="selection-grid">
        {mood.map((mood) => (
          <div
            key={mood}
            className={`selection-box ${selectedMood === mood ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(mood)}
          >
            {mood}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="continue-button-container">
        <button
          onClick={handleContinue}
          className={`continue-button ${selectedGenre && selectedMood ? '' : 'disabled'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default SelectGenremood;
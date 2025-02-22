import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Import images from assets
import homepageArt from '../assets/homepageart.png';
import buttonImage from '../assets/button.png';

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const text = "Completely Free!";

  // Create an array of spans for the text
  const letters = text.split('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 200); // Change interval for faster/slower animation

    return () => clearInterval(interval);
  }, [letters.length]);

  // Helper function to determine the class for each letter
  const getLetterClass = (index) => {
    const diff = (currentIndex - index + letters.length) % letters.length; // Only look behind
    if (diff === 0) return 'active'; // Current glowing letter
    if (diff === 1) return 'faded-1'; // Trailing letter 1
    if (diff === 2) return 'faded-2'; // Trailing letter 2
    return ''; // No glow for other letters
  };

  return (
    <div className="home-container text-center">
      <div className="wave-background"></div>
      <div className="row align-items-center justify-content-center">
        {/* Left Image */}
        <div className="col-md-3">
          <img src={homepageArt} alt="Left Graphic" className="img-fluid small-image" />
        </div>

        {/* Center Text */}
        <div className="col-md-6">
          <h1 className="pulse-text">Generate beats with AI</h1>
          <h1 className="text-purple neon-container">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`neon-text ${getLetterClass(index)}`}
                style={letter === ' ' ? { display: 'inline-block', width: '0.5em' } : {}}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Right Image */}
        <div className="col-md-3">
          <img src={homepageArt} alt="Right Graphic" className="img-fluid small-image right-image" />
        </div>
      </div>

      {/* Generate Song Button */}
      <Link to="/generate" className="btn-image mt-4">
        <img src={buttonImage} alt="Generate a Song" className="button-image" />
      </Link>
    </div>
  );
}

export default HomePage;

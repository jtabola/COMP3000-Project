import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SelectGenreInstrument from './pages/SelectGenreMood';
import GenerateLyrics from './pages/GenerateLyrics';
import GeneratedSong from './pages/GeneratedSong';
import FAQ from './pages/Faq';
import Licensing from './pages/Licensing';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="app-wrapper d-flex flex-column min-vh-100">
        <Navbar />
        <div className='container mt-4 flex-grow-1'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<SelectGenreInstrument />} />
            <Route path="/generate/lyrics" element={<GenerateLyrics />} />
            <Route path="/song" element={<GeneratedSong />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/licensing" element={<Licensing />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

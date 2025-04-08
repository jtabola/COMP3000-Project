# COMP3000-Project

A full-stack web application that generates **music lyrics**, **melody samples**, and **song titles** using the power of **AI**.

Link to Frontend - [Beat Fusion](https://beat-fusion.netlify.app)

Link to the Video - [Video](https://www.youtube.com/watch?v=I-QZbI5txHQ)

Built with:

- **Frontend:** React  
- **Backend:** Flask  
- **AI Models:** Three distinct models for lyrics generation (BART), melody synthesis (MusicGen), and title creation (T5).

---

## Features

-  Generate original **song lyrics** based on lyric ideas  
-  Create short **melody samples** based on genre and mood 
-  Use your own custom **song title** or generate one based on your lyrics 
-  Seamless integration between frontend and backend for a smooth experience

---

## AI Models Used

All of the models below obtained through **Hugging Face** - https://huggingface.co/models

The app leverages three specialised models:

1. **Lyrics Generator:** Trained on various genres and lyrical styles - nave1616/lyrics_model
2. **Melody Synthesizer:** Produces short, royalty-free melody clips - facebook/musicgen-small
3. **Title Creator:** Summarises the lyrics to produce a short title - Ateeqq/news-title-generator

---

##  Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React      |
| Backend   | Flask (Python)     |
| AI Models | Transformers & Pipelines from 🤗 Hugging Face |

---

##  Setup Instructions (NEED CHANGE)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   
2. **Set up the backend:**

   ```bash
   cd song-generator-backend
   pip install -r requirements.txt
   python app.py
   
1. **Set up the frontend:**

   ```bash
   cd song-generator
   npm install
   npm start

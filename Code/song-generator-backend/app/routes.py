import torch, os
from flask import Flask, Blueprint, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer, AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import scipy, re

# Initialize Flask app
app = Flask(__name__, static_folder='static')

# Set up Flask Blueprint and CORS
main = Blueprint('main', __name__, static_folder='static')
CORS(main)

# Function to generate melody
def generate_melody(genre, mood):
    try:
        synthesiser = pipeline("text-to-audio", model="facebook/musicgen-small")

        music = synthesiser(f"{mood} {genre} music", forward_params={"do_sample": True})
        # Output path where the generated melody will be saved
        output_path = "static/generated_music.wav"

        scipy.io.wavfile.write(output_path, rate=music["sampling_rate"], data=music["audio"])

        return output_path
    except Exception as e:
        print(f"Error generating melody: {str(e)}")
        return None

# Function to generate lyrics based on user input
def generate_lyrics(prompt, max_length=800):
    lyric_generator = pipeline("text2text-generation", model="nave1616/lyrics_model")
    lyrics = lyric_generator(prompt, max_length=max_length, num_return_sequences=1, clean_up_tokenization_spaces=True)
    
    lyrics = lyrics[0]["generated_text"]
    lyrics = lyrics[len(prompt):].strip()

    lyrics = lyrics.replace("[", "[")
    lyrics = lyrics.replace("(", "[")
    lyrics = lyrics.replace(")", "]")

    return lyrics

# Function to generate a title from lyrics using the T5 model
def generate_title(lyrics):

    prompt = f"{lyrics}"
    
    tokenizer = AutoTokenizer.from_pretrained("Ateeqq/news-title-generator")
    model = AutoModelForSeq2SeqLM.from_pretrained("Ateeqq/news-title-generator")

    input_ids = tokenizer.encode(prompt, return_tensors="pt")
    output = model.generate(input_ids,max_length=14)
    decoded_text = tokenizer.decode(output[0], skip_special_tokens=True)

    decoded_text = re.sub(r"[^\w\s]", "", decoded_text)

    return decoded_text

# Returns generated_music.wav
@main.route('/static/generated_music.wav', methods=['GET'])
def serve_file():
    static_folder_path = os.path.join(os.getcwd(), 'static')
    print(f"Static folder path: {static_folder_path}")
    return send_from_directory(static_folder_path, 'generated_music.wav')
                

@main.route('/generate', methods=['POST'])
def generate_song():
    data = request.json

    # Get the lyrics description and title flag from the input
    lyrics_description = data.get('lyrics_description', '')
    generate_title_flag = data.get('generate_title', False)  # Flag indicating if title should be generated
    
    # If no description is provided, return an error
    if not lyrics_description:
        return jsonify({"error": "No lyrics description provided"}), 400

    # Create the prompt for the GPT-2 model
    prompt = f"Write a song about {lyrics_description}:\n---\n"

    try:
        # Generate the song lyrics using the description
        song_lyrics = generate_lyrics(prompt)

        # Ensure the first letter is capitalized and add a full stop if missing
        if song_lyrics:
            song_lyrics = song_lyrics.strip()  # Remove extra spaces
            song_lyrics = song_lyrics[0].upper() + song_lyrics[1:]  # Capitalize the first letter
            if not song_lyrics.endswith(('.', '!', '?')):  # Add a full stop if not present
                song_lyrics += '.'

        # Optionally generate the title if the flag is True
        generated_title = None
        if generate_title_flag:
            generated_title = generate_title(song_lyrics)

        return jsonify({
            "lyrics": song_lyrics,
            "title": generated_title
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@main.route('/generate-melody', methods=['POST'])
def generate_melody_endpoint():
    data = request.json

    # Extract mood and genre from the request
    mood = data.get('mood', '')
    genre = data.get('genre', '')

    if not mood or not genre:
        return jsonify({"error": "Mood and genre are required"}), 400

    try:
        # Generate the melody
        melody_path = generate_melody(genre, mood)

        if not melody_path:
            return jsonify({"error": "Melody generation failed"}), 500

        # Return the melody URL
        melody_url = url_for('static', filename='generated_music.wav')  # Assuming the file is served from 'static' folder
        print(jsonify({"melody_url": melody_url}))
        return jsonify({"melody_url": melody_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/generate-title', methods=['POST'])
def generate_song_title():
    data = request.json

    # Get the lyrics from the input
    lyrics = data.get('lyrics', '')

    # If no lyrics are provided, return an error
    if not lyrics:
        return jsonify({"error": "No lyrics provided"}), 400

    try:
        # Generate a title from the lyrics
        title = generate_title(lyrics)

        return jsonify({
            "title": title
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

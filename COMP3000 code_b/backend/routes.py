import torch, os
from flask import Flask, Blueprint, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer, AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import scipy
from torch.cuda.amp import autocast

print(torch.cuda.is_available())  # Should return True if CUDA is available
print(torch.cuda.current_device())  # Check the current device (GPU)
print(torch.cuda.get_device_name(torch.cuda.current_device()))  # Name of the GPU

# Initialize Flask app
app = Flask(__name__, static_folder='static')

# Set up Flask Blueprint and CORS
main = Blueprint('main', __name__, static_folder='static')
CORS(main)

# Set device to GPU if available, otherwise fall back to CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Load the fine-tuned GPT-2 model and tokenizer for lyrics generation
gpt2_model_path = r"models\results_lyrics_final\checkpoint-319"
gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_path).to(device)  # Move model to GPU
gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_path)

# Ensure the GPT-2 tokenizer has a padding token
if gpt2_tokenizer.pad_token is None:
    gpt2_tokenizer.pad_token = gpt2_tokenizer.eos_token

# Load the T5 model and tokenizer for title generation
t5_model_path = r"models\local-title-model"
t5_tokenizer = AutoTokenizer.from_pretrained(t5_model_path)
t5_model = AutoModelForSeq2SeqLM.from_pretrained(t5_model_path).to(device)  # Move model to GPU

# Ensure the t5 tokenizer has a padding token
if t5_tokenizer.pad_token is None:
    t5_tokenizer.pad_token = t5_tokenizer.eos_token

def generate_melody(genre, mood):
    try:
        synthesiser = pipeline("text-to-audio", model="facebook/musicgen-small", device=0 if torch.cuda.is_available() else -1)

        music = synthesiser(f"{mood} {genre} music", forward_params={"do_sample": True})
        # Output path where the generated melody will be saved
        output_path = "static/generated_music.wav"

        scipy.io.wavfile.write(output_path, rate=music["sampling_rate"], data=music["audio"])

        return output_path
    except Exception as e:
        print(f"Error generating melody: {str(e)}")
        return None

# Function to generate lyrics based on user input
def generate_lyrics(prompt, max_length=250, temperature=0.8, top_k=50, top_p=0.75):
    # Tokenize the prompt on CPU to save GPU memory
    inputs = gpt2_tokenizer(prompt, return_tensors="pt").to('cpu')  # Move input tensors to CPU

    # Move the tensors to GPU for generation
    inputs = inputs.to(device)

    # Use torch.no_grad() to save memory during inference
    with torch.no_grad():
        # Generate text using the GPT-2 model
        outputs = gpt2_model.generate(
            inputs["input_ids"],
            max_length=max_length + len(inputs["input_ids"][0]),  # Account for prompt length
            num_return_sequences=1, 
            no_repeat_ngram_size=3,
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
            do_sample=True,
            pad_token_id=gpt2_tokenizer.pad_token_id,
            eos_token_id=gpt2_tokenizer.eos_token_id,
        )

    # Decode the output, excluding the prompt
    generated_text = gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text[len(prompt):].strip()  # Remove the prompt from the output

# Function to generate a title from lyrics using the T5 model
def generate_title(lyrics, max_length=8, num_beams=6):
    # Prepend "summarize:" to indicate title generation
    prompt = f"Summarize: {lyrics}"
    
    # Tokenize the input lyrics on CPU
    inputs = t5_tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True).to('cpu')  # Move input tensors to CPU
    
    # Move the tensors to GPU for generation
    inputs = inputs.to(device)

    # Use torch.no_grad() to save memory during inference
    with torch.no_grad():
        # Generate a title using the T5 model
        summary_ids = t5_model.generate(
            inputs["input_ids"],
            max_length=max_length,
            num_beams=num_beams,
            early_stopping=True,
            temperature=1.0
        )
    
    # Decode and return the generated title
    return t5_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

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
            "title": generated_title  # Include the title in the response if generated
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

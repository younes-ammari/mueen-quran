from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from openai import OpenAI
import os
from pydantic import BaseModel
import re
from datetime import datetime
from pathlib import Path
import sounddevice as sd
from scipy.io.wavfile import write
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from secret_keys import openai_api_key

client = OpenAI(api_key=openai_api_key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # السماح لجميع النطاقات
    allow_credentials=True,
    allow_methods=["*"],  # السماح بجميع أنواع الطلبات (GET, POST, إلخ)
    allow_headers=["*"],  # السماح بجميع الرؤوس
)

# Add this near the top of your file, after creating the FastAPI app
app.mount("/speech", StaticFiles(directory="speech"), name="speech")

class SurahAyahRequest(BaseModel):
    surah: str
    ayah_number: int
    aya_text: str
    aya_for_fix: str

def record_audio(filename="recording.wav", duration=5, fs=44100):
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=2)
    sd.wait()  # Wait for recording to finish
    write(filename, fs, recording)

@app.post("/record-audio/")
async def api_record_audio(duration: int = 5):
    filename = "./temp_audio/recording.wav"
    record_audio(filename, duration)
    return {"message": "Recording complete", "filename": filename}

@app.post("/transcribe-audio/")
# async def transcribe_audio(ayat: str, file: UploadFile = File(...)):
async def transcribe_audio(
    ayat: str = Form(...),  # Change to Form parameter
    file: UploadFile = File(...)
):
    # Ensure the directory exists
    temp_audio_dir = Path("./temp_audio")
    temp_audio_dir.mkdir(parents=True, exist_ok=True)

    file_path = temp_audio_dir / file.filename
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Continue with the transcription
    prompt = f"الصوت ربما يحتوي الكلمات التالية: {ayat}"
    
    if len(ayat)>3:
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                language="ar",
                file=audio_file,
                response_format="text",
                prompt=prompt
            )
    else :
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text",
            )
    return {"transcription": transcription}
@app.post("/fix-ayat/")
async def fix_ayat(data: SurahAyahRequest):
    prompt = f"""
    هذه الاية رقم {data.ayah_number} من سورة {data.surah}:
    "{data.aya_text}"
    الاية التي قرأها الطفل:
    "{data.aya_for_fix}"
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": '''
            أنت مساعد يساعد في تعليم القرآن صحح الاخطاء و أعطني النسبة تحليل التلاوة...
            ''',  # Full prompt as per your logic
            },
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024
    )

    ayah_text = completion.choices[0].message.content
    match = re.search(r"(\d+(\.\d+)?)%", ayah_text)
    accuracy_percentage = float(match.group(1)) if match else None

    return {"analysis": ayah_text, "accuracy": accuracy_percentage}

@app.get("/generate-speech/")
async def generate_speech(text: str):
    # Create speech directory if it doesn't exist
    speech_dir = Path.cwd() / "speech"
    speech_dir.mkdir(parents=True, exist_ok=True)

    # Generate timestamp and file paths
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    speech_file_name = f"speech_{timestamp}.mp3"
    speech_file_path = speech_dir / speech_file_name

    # Generate speech using OpenAI API
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text
    )
    response.write_to_file(speech_file_path)
    
    # Return the full URL path to the audio file
    return {"file_path": f"/speech/{speech_file_name}", "file_name":speech_file_name}

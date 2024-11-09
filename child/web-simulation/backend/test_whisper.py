from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()  # Load environment variables from .env file

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


# تجريب على قراءة القراء
with open("./surah/fatiha/2.mp3", "rb") as audio:
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio,
        response_format="text",
        # prompt=prompt
    )
    
user_text = transcription
print("====",user_text)


#تجريب من تسجيل صوتي 
def record_audio(filename="recording.wav", duration=5, fs=44100):
    print("Recording...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=2)
    sd.wait()  # انتظار انتهاء التسجيل
    write(filename, fs, recording)  # حفظ التسجيل في ملف
    print("Recording complete")
    
 record_audio("./temp_audio/recording.wav", duration=5)
        
        
with open("./temp_audio/recording.wav", "rb") as audio:
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio,
        response_format="text",
        prompt=prompt
    )
    
user_text = transcription
print("====",user_text)

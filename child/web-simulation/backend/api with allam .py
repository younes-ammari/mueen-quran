from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from openai import OpenAI
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import re
from datetime import datetime
from pathlib import Path
import sounddevice as sd
from scipy.io.wavfile import write
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form


import re
import datetime
import time
from pathlib import Path
import os
from termcolor import colored
from dotenv import load_dotenv
import requests

load_dotenv()  # Load environment variables from .env file

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)



# API credentials

project_id = os.getenv("Project_id")
IBM_Api_key = os.getenv("IBM_API_KEY")



# API credentials

project_id = os.getenv("Project_id")
IBM_Api_key = os.getenv("IBM_API_KEY")
Model_id=os.getenv("Model_id")



def get_access_token(api_key):
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": api_key
    }
    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()["access_token"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # السماح لجميع النطاقات
    allow_credentials=True,
    allow_methods=["*"],  # السماح بجميع أنواع الطلبات (GET, POST, إلخ)
    allow_headers=["*"],  # السماح بجميع الرؤوس
)

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
    
    access_token = get_access_token(api_key)
    url = "https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
 
        
    
    prompt = f'''
    

             أنت مساعد يساعد في تعليم القرآن صحح الاخطاء و أعطني النسبة تحليل التلاوة. مع حساب عدد الاخطاء و وإعطاء تحيل التلاوة وفق النموذج التالي :
                 
    - قارن تلاوة الطفل بالنص القرآني الصحيح لتحديد الأخطاء.
    - صنف الأخطاء إلى فئات مثل:
      - أخطاء في الحروف (تبديل أو حذف أو إضافة حرف).
      - أخطاء في الكلمات (تبديل كلمة بأخرى).
      - أخطاء في السياق (تغيير المعنى أو الخروج عن النص).

    تحديد وزن لكل نوع من الأخطاء:
    - خطأ في حرف: 1 نقطة.
    - خطأ في كلمة: 2 نقاط.
    - خطأ في السياق: 3 نقاط.

    اعطني حساب مجموع النقاط:
    - اجمع النقاط لكل الأخطاء المكتشفة للحصول على مجموع النقاط.

    اعطني حساب النسبة المئوية للتلاوة الصحيحة:
    - استخدم الصيغة التالية:
      النسبة المئوية = (1 - (مجموع النقاط / أقصى مجموع نقاط ممكن)) × 100
      حيث أن "أقصى مجموع نقاط ممكن" يمثل مجموع النقاط في حالة وجود أخطاء في كل حرف أو كلمة أو سياق.

    مثال توضيحي:
    - إذا كانت الآية تحتوي على 10 كلمات، وارتكب الطفل الأخطاء التالية:
      - خطأ في حرف واحد.
      - خطأ في كلمتين.

    الحساب:
    - مجموع النقاط: (1 × 1) + (2 × 2) = 1 + 4 = 5 نقاط.
    - أقصى مجموع نقاط ممكن: (10 كلمات × 2 نقاط لكل كلمة) = 20 نقطة.
    - النسبة المئوية للتلاوة الصحيحة: (1 - (5 / 20)) × 100 = 75%

    يرجى تصحيح الأخطاء وتقديم تقرير مفصل يشمل عدد الأخطاء من كل نوع وتصحيحها ونسبة الدقة.
    "{data.aya_text}"

    الاية التي قرأها الطفل:
    "{data.aya_for_fix}"

    '''

    body = {
    	"input": """قارن الايتين و اعطني عدد الاخطاء ومكان الخطا ونوع الخطأ لأضعها باللون الاحمر html format في الاية الصحيحة على json form :
    الاية الصحيحة :الحمد لله رب العالمين
    الاية المراد تصحيحها : الحمد للله رب العالمين

    s><s> [INST]""",
    	"parameters": {
    		"decoding_method": "greedy",
    		"max_new_tokens": 900,
    		"repetition_penalty": 1
    	},
    	"model_id": "sdaia/allam-1-13b-instruct",
    	"project_id": "ca92a894-9c29-4a44-b949-b9fd8773121a"
    }

    headers = {
    	"Accept": "application/json",
    	"Content-Type": "application/json",
    	"Authorization": "Bearer eyJraWQiOiIyMDI0MTEwMTA4NDIiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTYwMDBKRUZVIiwiaWQiOiJJQk1pZC02OTYwMDBKRUZVIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiMDI2YzFjNTAtMzM0Zi00YWY3LWJmMDItZTExOGE1N2ZiNzhkIiwiaWRlbnRpZmllciI6IjY5NjAwMEpFRlUiLCJnaXZlbl9uYW1lIjoiWW91bmVzIiwiZmFtaWx5X25hbWUiOiJBbW1hcmkiLCJuYW1lIjoiWW91bmVzIEFtbWFyaSIsImVtYWlsIjoiZGV2LnlvdW5lcy5hbW1hcmlAZ21haWwuY29tIiwic3ViIjoiZGV2LnlvdW5lcy5hbW1hcmlAZ21haWwuY29tIiwiYXV0aG4iOnsic3ViIjoiZGV2LnlvdW5lcy5hbW1hcmlAZ21haWwuY29tIiwiaWFtX2lkIjoiSUJNaWQtNjk2MDAwSkVGVSIsIm5hbWUiOiJZb3VuZXMgQW1tYXJpIiwiZ2l2ZW5fbmFtZSI6IllvdW5lcyIsImZhbWlseV9uYW1lIjoiQW1tYXJpIiwiZW1haWwiOiJkZXYueW91bmVzLmFtbWFyaUBnbWFpbC5jb20ifSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiODVlZmQ4ZTJhNTE2NDgzNTg3NWQyMzk3NDBiZDlmOTIiLCJpbXNfdXNlcl9pZCI6IjEyNjc3NzQ5IiwiZnJvemVuIjp0cnVlLCJpbXMiOiIyNzQ4MDc2In0sImlhdCI6MTczMTA3MjAzOSwiZXhwIjoxNzMxMDc1NjM5LCJpc3MiOiJodHRwczovL2lhbS5jbG91ZC5pYm0uY29tL2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.F_oyIAzgYwpuKkrSKjaml_akfV34i5OGbYCwawUB1GMAwwUI92N-tXo9qY_JjNjCB_CezNLndenvMw-1Qy8itlhEZ_n2Ntm97iYSbW_PGJ6PVkDvNmknPBpNSqI86Yao5vpg-N58NYWUrS0wAT7SccNefXefQTkJkG-E_ysa8jMxwMfc-U_66h2t2qEA1tmpxLSF3_xRDlo95ApbF5E5suxMgg6bR4HeaHxkNzkFQrSo3BdVPEIixMy7HeCQZUCroN5xW1xwYks_vMRirejGuEMzWAMDZ9XFhQ5Q8wl2E1Hrps-9nB7O_t5YX7Odqp9zIvY_XXVCsILaMfsIWiMGPA"
    }


    
    body = {
        "input": f"<s> [INST] {prompt} [/INST]",
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 4000,
            "repetition_penalty": 1,
        },
        "model_id": Model_id,
        "project_id": project_id
    }
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()
    data = response.json()
    
    # Extract JSON data from model response
    ayah_text = data["results"][0]["generated_text"]
    
    match = re.search(r"(\d+(\.\d+)?)%", ayah_text)
    accuracy_percentage = float(match.group(1)) if match else None

    
    
    


    return {"analysis": ayah_text, "accuracy": accuracy_percentage}

@app.get("/generate-speech/")
async def generate_speech(text: str):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    speech_file_name = f"speech_{timestamp}.mp3"
    speech_file_path = Path.cwd() / "speech" / speech_file_name

    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text
    )
    response.stream_to_file(speech_file_path)
    return {"file_name": speech_file_name}

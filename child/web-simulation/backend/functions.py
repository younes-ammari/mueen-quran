import sounddevice as sd
from scipy.io.wavfile import write
from openai import OpenAI
import os
from pathlib import Path
import re
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("API_KEY")
client = OpenAI(api_key=api_key)


def record_audio(filename="recording.wav", duration=5, fs=44100):
    """Record audio for a given duration and save to a file."""
    print("Recording...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=2)
    sd.wait()  # Wait for the recording to finish
    write(filename, fs, recording)  # Save the recording to a file
    print("Recording complete")


def transcript(ayat):
    """Transcribe audio input or take text input from the user."""
    input_text = False

    if input_text:
        prompt = ""
        sorted_words = sorted(ayat.split())
        sorted_ayat = ",".join(sorted_words)
        prompt = f"الصوت ربما يحتوي الكلمات التالية: {sorted_ayat}"

        record_audio("./temp_audio/recording.wav", duration=5)

        with open("./temp_audio/recording.wav", "rb") as audio:
            transcription = client.audio.transcriptions.create(
                model="whisper-1", file=audio, response_format="text", prompt=prompt
            )

        user_text = transcription
        user_text = user_text.replace(",", " ")
        print("====", user_text)
        return user_text
    else:
        user_text = input("أدخل الاية \n")
        return user_text


def generate_speech(text):
    """Generate speech from text and save it to a file."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    speech_file_name = f"speech_{timestamp}.mp3"
    speech_file_path = Path.cwd() / "speech" / speech_file_name

    response = client.audio.speech.create(model="tts-1", voice="alloy", input=text)
    response.stream_to_file(speech_file_path)

    return speech_file_name


def prompt_child_to_write(surah, ayah_number):
    """Prompt the child to write a specific ayah."""
    prompt = f"صحح الآية {ayah_number} من سورة {surah}."

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "أنت مساعد يساعد في تعليم القرآن صحح الاخطاء.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=50,
    )

    ayah_text = completion.choices[0].message.content
    return ayah_text


def fix_ayat(surah, ayah_number, aya_text, aya_for_fix):
    """Fix the ayah based on the child's recitation and provide feedback."""
    prompt = f"""
    هذه الاية رقم {ayah_number} من سورة {surah}:
    "{aya_text}"

    الاية التي قرأها الطفل:
    "{aya_for_fix}"
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": """
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

    يرجى تصحيح الأخطاء وتقديم تقرير مفصل يشمل عدد الأخطاء من كل نوع وتصحيحها ونسبة الدقة.
                 """,
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=1024,
    )

    ayah_text = completion.choices[0].message.content
    return ayah_text

# -*- coding: utf-8 -*-
"""
Created on Sun Nov  3 22:02:24 2024

@author: benna
"""
from openai import OpenAI
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

from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


ayat_al_fatiha = [
    {"ayah_number": 1, "text": "الحمد لله رب العالمين"},
    {"ayah_number": 2, "text": "الرحمن الرحيم"},
    {"ayah_number": 3, "text": "مالك يوم الدين"},
    {"ayah_number": 4, "text": "إياك نعبد وإياك نستعين"},
    {"ayah_number": 5, "text": "اهدنا الصراط المستقيم"},
    {"ayah_number": 6, "text": "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين"}
]


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


import sounddevice as sd
from scipy.io.wavfile import write


def record_audio(filename="recording.wav", duration=5, fs=44100):
    print("Recording...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=2)
    sd.wait()  # انتظار انتهاء التسجيل
    write(filename, fs, recording)  # حفظ التسجيل في ملف
    print("Recording complete")


def transcript(ayat):
    
    input_text=False
    
    if input_text :
    
        prompt = ""

    
         # ayat="الحمد لله رب العالمين"
        sorted_words = sorted(ayat.split())
        
        print(sorted_words)
    
    # إعادة جمع الكلمات بفراغات بينهما
        sorted_ayat = ",".join(sorted_words)
        prompt = f"الصوت ربما يحتوي الكلمات التالية: {sorted_ayat}"
        
    
                    # استدعاء الدالة لتسجيل الصوت لمدة 5 ثوانٍ وحفظه في ملف
        record_audio("./temp_audio/recording.wav", duration=5)
        
        
        with open("./temp_audio/recording.wav", "rb") as audio:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio,
                response_format="text",
                prompt=prompt
            )
            
        user_text = transcription
        user_text=user_text.replace(","," ")
        print("====",user_text)
    
    
        # conversations[conversation_id]['messages'].append({"user": user_text})
        
        # os.remove(audio_path)
    
        return user_text
    else:
        user_text=input("أدخل الاية \n")
        return user_text


def generate_speech(text):
    # توليد طابع زمني بصيغة YYYYMMDD_HHMMSS
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # تحديد مسار الملف باستخدام Path.cwd() بدلاً من __file__
    speech_file_name = f"speech_{timestamp}.mp3"
    speech_file_path = Path.cwd() / "speech" / speech_file_name
    
    # توليد الصوت وحفظه في الملف المحدث
    response = client.audio.speech.create(
      model="tts-1",
      voice="alloy",
      input=text
    )
    
    response.stream_to_file(speech_file_path)
    
    # إرجاع اسم الملف
    return speech_file_name






def fix_ayat(surah, ayah_number,aya_text, aya_for_fix):

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
    "{aya_text}"

    الاية التي قرأها الطفل:
    "{aya_for_fix}"

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
    data_text = data["results"][0]["generated_text"]

  
    return data_text








def main():
    surah = "الفاتحة"
    previous_ayat = []
    
    for i, aya in enumerate(ayat_al_fatiha):
        repeat = True
        
        while repeat:
            print(f"\nالآية {aya['ayah_number']}: {aya['text']}")
            # ayat_fix = input("اكتب الآية أعلاه واضغط Enter لتستمر... \n")
            
            ayat_fix=transcript(aya['text'])
            print ("========-----=========",ayat_fix)
            # return
            
            # حساب نسبة الدقة عبر الدالة
            resp = fix_ayat(surah, aya['ayah_number'], aya['text'], ayat_fix)
            
            # استخراج نسبة الدقة
            match = re.search(r"(\d+(\.\d+)?)%", resp)
            if match:
                accuracy_percentage = float(match.group(1))  # تحويل النسبة إلى رقم عشري
                print(f"نسبة حفظ الطفل للاية هي: {accuracy_percentage}%")
            else:
                print("لم يتم العثور على نسبة مئوية في النص.")
                continue  # كرر المحاولة إذا لم تُعرف النسبة

            # شروط الانتقال وإعادة الآيات
            if accuracy_percentage == 100:
                if len(previous_ayat) == 1:
                    
                    repeat_=True
                    while repeat:

                        print("تجاوزت نسبة الدقة 100%. لقد حفظت آيتين الرجاء إعادتهم:")
                        for p_aya in previous_ayat:
                            print(f"{p_aya['ayah_number']} {p_aya['text']}")
                        print(f"{aya['ayah_number']} {aya['text']}")
                        
                        
                        # دمج نص الآيات مع أرقامها
                        ayat_text = " ".join([p_aya['text'], aya['text']])
                        ayat_number = " ".join([str(p_aya['ayah_number']), str(aya['ayah_number'])])



                        # ayat_fix=input("اكتب الآيتين أعلاه واضغط Enter لتستمر... \n")
                        print("اكتب الآيتين أعلاه   .../n")
                        ayat_fix=transcript(ayat_text)
                        
                        resp = fix_ayat(surah, ayat_number, ayat_text, ayat_fix)
                        
                        
                        
                        match = re.search(r"(\d+(\.\d+)?)%", resp)
                        if match:
                            accuracy_percentage_ = float(match.group(1))  # تحويل النسبة إلى رقم عشري
                            print(f"نسبة حفظ الطفل للاية هي: {accuracy_percentage}%")
                        else:
                            print("لم يتم العثور على نسبة مئوية في النص.")
                            continue  # 
                        if accuracy_percentage_ >= 70:
    
    
                            previous_ayat = []  # إعادة تعيين الآيات المحفوظة
                            previous_ayat.append(aya)
                            
                            
                            repeat = False
                        repeat_=False
                        
                else:
                    print("تجاوزت نسبة الدقة 100%. يمكن الانتقال إلى الآية التالية.")
                    previous_ayat.append(aya)  # أضف الآية إلى الآيات المحفوظة
                    repeat = False
     
            else:
                print("لم يتم تحقيق نسبة الدقة المطلوبة. الرجاء إعادة الآية.")

    print("\nمبروك! لقد أنهيت حفظ سورة الفاتحة.")

main()






if __name__ == "__main__":
    main()

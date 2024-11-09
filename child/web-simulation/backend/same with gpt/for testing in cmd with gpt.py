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

load_dotenv()  # Load environment variables from .env file

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)




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

def prompt_child_to_write(surah, ayah_number):
    prompt = f"صحح الآية {ayah_number} من سورة {surah}."

    completion = client.chat.completions.create(
        model="gpt-4o",  # تأكد من استخدام النموذج المتاح لديك
        messages=[
            {"role": "system", "content": "أنت مساعد يساعد في تعليم القرآن صحح الاخطاء."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=50
    )

    print(".....................")
    ayah_text = completion.choices[0].message.content
    return ayah_text




def fix_ayat(surah, ayah_number,aya_text, aya_for_fix):

    
    prompt = f'''
    هذه الاية رقم {ayah_number} من سورة {surah}:
    "{aya_text}"

    الاية التي قرأها الطفل:
    "{aya_for_fix}"

    '''

    completion = client.chat.completions.create(   
        model="gpt-4o",  # تأكد من استخدام النموذج المتاح لديك
        messages=[
            {"role": "system", "content": 
             '''
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
                 '''
             
             },
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024
    )

    print(".....................")
    ayah_text = completion.choices[0].message.content
    return ayah_text


ayat_al_fatiha = [
    {"ayah_number": 1, "text": "الحمد لله رب العالمين"},
    {"ayah_number": 2, "text": "الرحمن الرحيم"},
    {"ayah_number": 3, "text": "مالك يوم الدين"},
    {"ayah_number": 4, "text": "إياك نعبد وإياك نستعين"},
    {"ayah_number": 5, "text": "اهدنا الصراط المستقيم"},
    {"ayah_number": 6, "text": "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين"}
]





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

# استدعاء الدالة الرئيسية
main()






if __name__ == "__main__":
    main()

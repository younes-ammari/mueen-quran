# -*- coding: utf-8 -*-
"""
Created on Fri Nov  8 19:25:43 2024

@author: benna
"""


import json
import os
from tabulate import tabulate
import requests
import re



from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


# API credentials

project_id = os.getenv("Project_id")
IBM_Api_key = os.getenv("IBM_API_KEY")
Model_id=os.getenv("Model_id")


# Load JSON data from a file into a variable
file_path = './data.json'
with open(file_path, 'r', encoding='utf-8') as file:
    test_data = json.load(file)





# Function to obtain access token
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

def compare_verses(api_key, p_id, model_id, aya_correct, aya_incorrect):
    aya_correct="قل هو الله أحد"
    aya_incorrect="قل هو الله أحد الله"
    access_token = get_access_token(api_key)
    url = "https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
    

    
        
    prompt = f"""
    قارن الآيتين وأعطني عدد الأخطاء، موقع الخطأ، ونوع الخطأ لتلوينها باللون الأحمر في الآية الصحيحة بصيغة JSON فقط دون أي نص إضافي.
    الآية الصحيحة: {aya_correct}
    الآية المراد تصحيحها: {aya_incorrect}
    
    
    يجب أن يكون الإخراج بصيغة JSON فقط كالتالي:
        
    {{
      "correct_verse": "{aya_correct}",
      "test_verse": "{aya_incorrect}",
      "error_count": عدد الأخطاء,
      "errors": [
        {{
          "position": موقع الخطأ,
          "error_type": "نوع الخطأ",
          "note": "ملاحظة"
        }}
        // يمكن تكرار هذا الكائن لكل خطأ
      ]
    }}
    """
  
    
  
    
    body = {
        "input": f"<s> [INST] {prompt} [/INST]",
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 4000,
            "repetition_penalty": 1,
        },
        "model_id": model_id,
        "project_id": p_id
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
    
    
    

    # Original data_text
    
    # Add line breaks after commas and braces for readability
    formatted_data = re.sub(r'([,{])\s*', r'\1\n', data_text)
    formatted_data = re.sub(r'\s*([}\]])', r'\n\1', formatted_data)
    
    # Additional formatting to add indentation (optional)
    formatted_data = re.sub(r'(\[|\{)', r'\1\n    ', formatted_data)
    formatted_data = re.sub(r'(\])', r'\n\1', formatted_data)
    formatted_data = re.sub(r'(: )', r':\n    ', formatted_data)
    
    return (formatted_data)
    
    
    
    
    
    
    
    



# # دالة لحساب نسبة الدقة
def calculate_accuracy(results):
    correct = sum(result["is_correct"] for result in results)
    accuracy = correct / len(results) * 100
    return accuracy




# # دالة اختبار النموذج
def test_Allam(test_data, compare_verses):
    results = []
    for test_case in test_data:
        # جلب الآية الصحيحة والخاطئة
        correct_verse = test_case["correct_verse"]
        test_verse = test_case["test_verse"]
        # error_count = test_case["error_count"]
        # error_type = test_case["error_type"]

        # استدعاء النموذج لتحليل الآية
        model_output = "rrrrr"
        
        try:
            model_output = compare_verses(IBM_Api_key, project_id, Model_id, correct_verse, test_verse)
            print("API Model Results:", model_output)
        except Exception as e:
            print("API Model failed:", e)
            model_output = None
            
        table_data = []
        table_data.append([str(test_case), model_output])
        headers = ["Test Data", "Allam Output "]
        
        
        
        # Print the table with a beautiful style
        # print("=" * 30)
        print(tabulate(table_data, headers=headers, tablefmt="fancy_grid"))
        # print("=" * 30)
        
            
            
        # model_output =compare_verses(api_key, p_id, model_id, correct_verse, test_verse)
        
        
        # break
    
        user_input = input("هل العدد المتوقع للأخطاء صحيح؟ إذا كان صحيحًا أدخل 1، إذا كان خاطئًا أدخل 0: ")

        while True:
            # Prompt user input to confirm if the result is correct
            user_input = input("هل العدد المتوقع للأخطاء صحيح؟ إذا كان صحيحًا أدخل 1، إذا كان خاطئًا أدخل 0: ")
        
            # Check user input and set is_correct_count
            if user_input == '1':
                is_correct_count = True
                print("العدد المتوقع للأخطاء صحيح.", is_correct_count)
                break  # Exit the loop since input is valid
            elif user_input == '0':
                is_correct_count = False
                print("العدد المتوقع للأخطاء غير صحيح. تحقق من العدد المتوقع للأخطاء.", is_correct_count)
                break  # Exit the loop since input is valid
            else:
                print("إدخال غير صالح، يرجى إدخال 1 أو 0 فقط.")  # Repeat if input is invalid

                    
        # Prompt user input to confirm if the error type and position are correct
        while True:
            user_input = input("هل نوع الخطأ والموقع صحيح؟ إذا كان صحيحًا أدخل 1، إذا كان خاطئًا أدخل 0: ")
        
            if user_input == '1':
                is_correct_details = True
                print("نوع الخطأ والموقع صحيح.", is_correct_details)
                break  # Exit the loop since input is valid
            elif user_input == '0':
                is_correct_details = False
                print("نوع الخطأ والموقع غير صحيح. يرجى التحقق من نوع الخطأ والموقع.", is_correct_details)
                break  # Exit the loop since input is valid
            else:
                print("إدخال غير صالح، يرجى إدخال 1 أو 0 فقط.")  # Repeat if input is invalid
                
                


        # تحقق إذا كانت النتيجة النهائية صحيحة
        is_correct = is_correct_count and is_correct_details
        print(" النتيجة النهائية صحيحة", is_correct_count)
        # input("===========")

        # إضافة النتيجة إلى القائمة
        results.append({
            "test_case": test_case,
            "model_output": model_output,
            "is_correct_count":is_correct_count,
            "is_correct_details":is_correct_details,
            "is_correct": is_correct
        })


    return results







# # تشغيل الاختبار على بيانات الاختبار باستخدام النموذج
results = test_Allam(test_data, compare_verses)


    # حساب الدقة الكلية
# accuracy = calculate_accuracy(results)
# print(f"Model accuracy: {accuracy:.2f}%")

from secret_keys import allam_api_key

model_id = "sdaia/allam-1-13b-instruct"
parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 500,
    "repetition_penalty": 1,
}

project_id = "ca92a894-9c29-4a44-b949-b9fd8773121a"
space_id = ""

api_key = allam_api_key


def get_credentials():
    return {"url": "https://eu-de.ml.cloud.ibm.com", "apikey": api_key}


from ibm_watsonx_ai.foundation_models import Model

model = Model(
    model_id=model_id,
    params=parameters,
    credentials=get_credentials(),
    project_id=project_id,
    space_id=space_id,
)


print("Submitting generation request...")
prompt = f"""
context:
انت روبوت معين لتحفيظ القرآن الكريم
question: السلام عليكم
answer:
"""
# generated_response = model.generate_text(prompt=prompt, guardrails=False)
generated_response = model.generate(prompt=prompt, guardrails=False)
# print(generated_response)
for text in generated_response["results"]:
    print(text["generated_text"])

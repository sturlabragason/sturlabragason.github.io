import requests
import os

API_ENDPOINT = "https://api.example.com/llm_agent/send_code"

code_path = "./terraform/main.tf"

with open(code_path, "r") as file:
    code = file.read()

data = {
    "code": code,
    "agent": "openai-chatgpt4"
}

response = requests.post(API_ENDPOINT, json=data)

if response.status_code == 200:
    print("Code sent to LLM agent.")
else:
    print("Failed to send code to LLM agent.")

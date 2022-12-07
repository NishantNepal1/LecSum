import os
import openai


input = "The maximum number of tokens to generate in the completion.The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096)."

openai.api_key = ""


def summarize(temp = 0, textInput = "Say this is a test"):
  response = openai.Completion.create(
    model = "text-davinci-003",
    prompt = textInput,
    max_tokens = 2000,
    temperature = temp
  )

  print(response)

def __init_():
  print("openAI file working!")
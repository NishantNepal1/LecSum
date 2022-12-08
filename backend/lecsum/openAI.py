import os
import openai


input = "With next-generation video game systems such as the Xbox One and the Playstation 4 hitting stores later this month, the console wars got even hotter today as electronics manufacturer Zenith announced the release of its own console, the Gamespace Pro, which arrives in stores Nov. 19. “With its sleek silver-and-gray box, double-analog-stick controllers, ability to play CDs, and starting price of $374.99, the Gamespace Pro is our way of saying, ‘Move over, Sony and Microsoft, Zenith is now officially a player in the console game,’” said Zenith CEO Michael Ahn at a Gamespace Pro press event, showcasing the system’s launch titles MoonChaser: Radiation, Cris Collinsworth’s Pigskin 2013, and survival-horror thriller InZomnia. “With over nine launch titles, 3D graphics, and the ability to log on to the internet using our Z-Connect technology, Zenith is finally poised to make some big waves in the video game world.” According to Zenith representatives, over 650 units have already been preordered."

openai.api_key = ""


def summarize(temp = 0, textInput = "Say this is a test"):
  response = openai.Completion.create(
    model = "text-davinci-003",
    prompt = f"Summarize this for a collegge student:\n\n{textInput}",
    max_tokens = 2022,
    temperature = temp,
    top_p = 1,
    frequency_penalty = 0,
    presence_penalty = 0
  )

  print(response)


# summarize(0.9, input)

def __init_():
  # summarize(0, input)
  print("openAI file working!")
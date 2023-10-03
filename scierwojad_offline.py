import discord
from discord.ext import commands
import json
import unicodedata
import asyncio

# Load the config file
with open('config.json', 'r') as file:
    config = json.load(file)

TOKEN = config['token_scierwojad']

intents = discord.Intents.default()
intents.voice_states = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

AUDIO_FILE_PATH = 'scierwojady.mp3'  # Replace with the path to your audio file

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    only_ascii = nfkd_form.encode('ASCII', 'ignore')
    return only_ascii.decode('ASCII').lower()


@bot.event
async def on_ready():
    print(f"We have logged in as {bot.user}")

@bot.event
async def on_message(message):
    if remove_accents("ścierwojad") in remove_accents(message.content):
        voice_channel = message.author.voice.channel if message.author.voice else None
        if voice_channel:
            vc = await voice_channel.connect()

            while message.author in voice_channel.members:
                if not vc.is_playing():
                    vc.play(discord.FFmpegPCMAudio(executable="ffmpeg", source=AUDIO_FILE_PATH))
                await asyncio.sleep(1)

            await vc.disconnect()

    await bot.process_commands(message)  # Important to allow other commands to be processed

bot.run(TOKEN)
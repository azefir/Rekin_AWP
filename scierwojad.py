import discord
from discord.ext import commands
import yt_dlp as youtube_dl
import asyncio
import unicodedata
import json

# Load the config file
with open('config.json', 'r') as file:
    config = json.load(file)

TOKEN = config['token_scierwojad']

YOUTUBE_URL = "https://youtu.be/Ub2NCwDLQ50"  # Replace with the YouTube video URL you want to play

intents = discord.Intents.default()
intents.voice_states = True
intents.messages = True
intents.message_content = True  # Add this line

bot = commands.Bot(command_prefix="!", intents=intents)

def get_best_audio_url(video_info):
    best_audio = None
    for format in video_info['formats']:
        if format.get('vcodec') == 'none':  # this is an audio-only format
            abr = format.get('abr', 0)
            best_abr = best_audio.get('abr', 0) if best_audio else 0
            
            if not best_audio or (abr and abr > best_abr):
                best_audio = format
    return best_audio['url'] if best_audio else None


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

            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            }

            video_info = youtube_dl.YoutubeDL(ydl_opts).extract_info(YOUTUBE_URL, download=False)
            audio_url = get_best_audio_url(video_info)

            while message.author in voice_channel.members:
                if not vc.is_playing():
                    vc.play(discord.FFmpegPCMAudio(executable="ffmpeg", source=audio_url))
                await asyncio.sleep(1)
                
            await vc.disconnect()

    await bot.process_commands(message)  # Important to allow other commands to be processed

bot.run(TOKEN)

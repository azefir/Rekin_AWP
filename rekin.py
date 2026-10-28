import discord
import json
import random
import asyncio

# Load the config file
with open('config.json', 'r') as file:
    config = json.load(file)

TOKEN = config['token']  # Put token in config.json

intents = discord.Intents.default()
intents.guilds = True               # Idk but it's needed
intents.voice_states = True         # For tracking voice channels
intents.guild_reactions = True      # For emoji reactions
intents.guild_messages = True       # For writing messages
intents.dm_messages = True          # For responding, also needs guild_messages
intents.message_content = True      # For tracking all messages

client = discord.Client(intents=intents)

# Input Discord user ID below
# Pietrek = 187807207633453056
TARGET_USER_ID = 187807207633453056

piwocounter = 0

# PIWO messages
piwomessages = [
    ":beer: Piwo piwo to moje paliwo boże jak uwielbiam piwo piwo :beer:",
    ":beer: Biegnę żeby pić więcej PIWA :beer:",
    ":beer: Beer Beer is my fuel :beer:",
    ":beer: Piję PIWO trzy razy w tygodniu - wczoraj, dziś i jutro :beer:",
    ":beer: PIWO lepsze od chleba bo gryźć nie trzeba :beer:",
    ":beer: PIWO to nie klej, więc nie wąchaj tylko CHLEJ :beer:",
    ":beer: PIWO nie pyta - PIWO rozumie :beer:",
    ":beer: Brzuch nie jest od PIWA - brzuch jest na PIWO :beer:",
    ":beer: PIWO ma niewiele witamin, dlatego potrzebuję dużo PIWA :beer:",
    ":beer: Alkoholowe trunki to moje ładunki :beer:",
]

# LEAN messages
leanmessages = [
    ":grapes: LEAN LEAN LUBIE PIĆ LEAN :grapes:",
    ":grapes: LEAN pić musze bo sie udusze :grapes:",
    ":grapes: Boże jak ja uwielbiam LEAN :grapes:",
]


@client.event
async def on_ready():
    print(f"We have logged in as {client.user}")


@client.event
async def on_voice_state_update(member, before, after):
    global piwocounter

    is_target = member.id == TARGET_USER_ID
    is_muted = after.self_mute
    old_channel = before.channel
    channel = after.channel
    joined = channel is not None and (old_channel is None or old_channel.id != channel.id)

    if not is_target or channel is None or not (joined or is_muted):
        return

    piwocounter += 1
    try:
        if joined:
            print(f'{member.display_name} has joined the voice channel "{channel.name}" - executing order PIWO \nPIWO counter: {piwocounter}')
        if is_muted:
            print(f"{member.display_name} muted himself, better let everyone know...\nPIWO counter: {piwocounter}")

        connection = channel.guild.voice_client
        if connection:
            await connection.disconnect(force=True)

        vc = await channel.connect()
        audio_file = 'pietrek_nicniemow.mp3' if is_muted else 'pietrek_pietreksmiec.mp3'  # MP3 names here with conditions

        def after_play(error):
            if error:
                print(error)
            # Leave the channel once the clip is done
            asyncio.run_coroutine_threadsafe(vc.disconnect(), client.loop)

        vc.play(discord.FFmpegPCMAudio(executable="ffmpeg", source=audio_file), after=after_play)
    except Exception as error:
        print(error)


@client.event
async def on_message(message):
    global piwocounter

    # Ignore messages authored by bots (including this one)
    if message.author.bot:
        return

    content = message.content.lower()

    if client.user.mentioned_in(message):
        piwocounter += 1
        await message.reply(':beer: Alkoholowe napoje to moje naboje :beer:')
        await message.add_reaction('🍺')
        # Console log for bot host
        print(f"PIWO counter: {piwocounter}")

    if "piwo" in content or "beer" in content:
        piwocounter += 1
        # Console log for bot host
        print(f"Did someone say [piwo]? \nPIWO counter: {piwocounter}")
        await message.reply(random.choice(piwomessages))
        await message.add_reaction('🍺')

    if "lean" in content:
        # Console log for bot host
        print("Did someone say [lean]?")
        await message.reply(random.choice(leanmessages))
        await message.add_reaction('🍇')


client.run(TOKEN)

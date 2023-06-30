const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');     //Put token in config.json
const client = new Client({ 
  intents: [ 
    GatewayIntentBits.Guilds,                   //Idk but it's needed
    GatewayIntentBits.GuildVoiceStates,         //For tracking voice channels I think
    GatewayIntentBits.GuildMessageReactions,    //For emoji reactions
    GatewayIntentBits.GuildMessages,            //For writing messages
    GatewayIntentBits.DirectMessages,           //For responding, also needs GuildMessages
    GatewayIntentBits.MessageContent            //For tracking all messages
  ] 
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

var piwocounter=0;

  client.on('voiceStateUpdate', async (oldState, newState) => {
    const user = newState.member.user;
    // Input Discord user ID below
    // Pietrek = 187807207633453056
    const isTarget = user.id === '187807207633453056'
    const isMuted = newState.selfMute;
    const oldChannel = oldState.channel;
    const channel = newState.channel;

    if (isTarget && (channel && (!oldChannel || oldChannel.id !== channel.id) || isMuted)) {
      piwocounter++
      try {
        if ((!oldChannel || oldChannel.id !== channel.id)) {
          console.log(`${newState.member.displayName} has joined the voice channel "${newState.channel.name}" - executing order PIWO \nPIWO counter: ${piwocounter}`);
        }
        if (isMuted) {
          console.log(`${newState.member.displayName} muted himself, better let everyone know...\nPIWO counter: ${piwocounter}`);
        }
        const connection = getVoiceConnection(channel.guild.id);
        if (connection) {
          connection.destroy();
        }
        const voiceConnection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const player = createAudioPlayer();
        const audioFile = isMuted ? 'pietrek_nicniemow.mp3' : 'pietrek_pietreksmiec.mp3';    // MP3 names here with conditions
        const stream = createReadStream(audioFile);
        const resource = createAudioResource(stream);
        player.play(resource);
        voiceConnection.subscribe(player);
        player.on(AudioPlayerStatus.Idle, () => {
          voiceConnection.destroy();
        });
        voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
          player.stop();
        });
      } catch (error) {
        console.error(error);
      }
    }
});

  client.on('messageCreate', message => {
    // Ignore messages authored by the bot itself
    if (message.author.bot) {
      return;
    }

    if (message.mentions.has(client.user)) {
      piwocounter++
      message.reply(':beer: Alkoholowe napoje to moje naboje :beer:')
      .then(() => message.react('🍺'));
      console.log(
        // Console log for bot host
        `PIWO counter: ${piwocounter}`
      );
    }

    if (message.content.toLowerCase().includes("piwo") || message.content.toLowerCase().includes("beer")) {
      piwocounter++
      var rand_msg_id=(getRandomInt(1,10));
      console.log(
        // Console log for bot host
        `Did someone say [piwo]? \nPIWO counter: ${piwocounter}`
      );
      switch (rand_msg_id) {
        case 1:
          message.reply(':beer: Piwo piwo to moje paliwo boże jak uwielbiam piwo piwo :beer:')
          .then(() => message.react('🍺'));
          break;
        case 2:
          message.reply(':beer: Biegnę żeby pić więcej PIWA :beer:')
          .then(() => message.react('🍺'));
          break;
        case 3:
          message.reply(':beer: Beer Beer is my fuel :beer:')
          .then(() => message.react('🍺'));
          break;
        case 4:
          message.reply(':beer: Piję PIWO trzy razy w tygodniu - wczoraj, dziś i jutro :beer:')
          .then(() => message.react('🍺'));
          break;
        case 5:
          message.reply(':beer: PIWO lepsze od chleba bo gryźć nie trzeba :beer:')
          .then(() => message.react('🍺'));
          break;
        case 6:
          message.reply(':beer: PIWO to nie klej, więc nie wąchaj tylko CHLEJ :beer:')
          .then(() => message.react('🍺'));
          break;
        case 7:
          message.reply(':beer: PIWO nie pyta - PIWO rozumie :beer:')
          .then(() => message.react('🍺'));
          break;
        case 8:
          message.reply(':beer: Brzuch nie jest od PIWA - brzuch jest na PIWO :beer:')
          .then(() => message.react('🍺'));
          break;
        case 9:
          message.reply(':beer: PIWO ma niewiele witamin, dlatego potrzebuję dużo PIWA :beer:')
          .then(() => message.react('🍺'));
          break;
      }
    }

    if (message.content.toLowerCase().includes("lean")) {
      var rand_msg_id=(getRandomInt(1,3));
      console.log(
        // Console log for bot host
        `Did someone say [lean]?`
      );
      switch (rand_msg_id) {
        case 1:
          message.reply(':grapes: LEAN LEAN LUBIE PIĆ LEAN :grapes:')
          .then(() => message.react('🍇'));
          break;
        case 2:
          message.reply(':grapes: LEAN pić musze bo sie udusze :grapes:')
          .then(() => message.react('🍇'));
          break;
      }
    }
});

client.login(token);

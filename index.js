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

var piwocounter=0;

  client.on('voiceStateUpdate', async (oldState, newState) => {
    // Input Discord user ID below
    // Pietrek = 187807207633453056
    if (newState.member.user.id === '187807207633453056') {
    const channel = newState.channel;
    if (channel) {
      try {
        console.log(
            // Console log for bot host
            `${newState.member.displayName} has joined the voice channel "${newState.channel.name}" - executing order PIWO \nPIWO execution counter: ${piwocounter}`
          );
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
        const stream = createReadStream('Pietreksmiec.mp3');    // MP3 name here
        const resource = createAudioResource(stream);
        player.play(resource);
        piwocounter++
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
  }
});

  client.on('messageCreate', message => {
      // Ignore messages authored by the bot itself
    if (message.author.bot) {
      return;
    }

    if (message.mentions.has(client.user)) {
      message.reply(':beer: Alkoholowe napoje to moje naboje :beer:')
      .then(() => message.react('🍺'));
    }

    if (message.content.toLowerCase().includes("piwo")) {
      console.log(
        // Console log for bot host
        `Ktos napisal piwo`
      );
      message.reply(':beer: Piwo piwo to moje paliwo boże jak uwielbiam piwo piwo :beer:')
      .then(() => message.react('🍺'));
    }
});

client.login(token);

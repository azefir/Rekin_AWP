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

//PIWO messages
const piwomessage_array=[];
piwomessage_array[0]=":beer: Piwo piwo to moje paliwo boże jak uwielbiam piwo piwo :beer:"
piwomessage_array[1]=":beer: Biegnę żeby pić więcej PIWA :beer:"
piwomessage_array[2]=":beer: Beer Beer is my fuel :beer:"
piwomessage_array[3]=":beer: Piję PIWO trzy razy w tygodniu - wczoraj, dziś i jutro :beer:"
piwomessage_array[4]=":beer: PIWO lepsze od chleba bo gryźć nie trzeba :beer:"
piwomessage_array[5]=":beer: PIWO to nie klej, więc nie wąchaj tylko CHLEJ :beer:"
piwomessage_array[6]=":beer: PIWO nie pyta - PIWO rozumie :beer:"
piwomessage_array[7]=":beer: Brzuch nie jest od PIWA - brzuch jest na PIWO :beer:"
piwomessage_array[8]=":beer: PIWO ma niewiele witamin, dlatego potrzebuję dużo PIWA :beer:"
piwomessage_array[9]=":beer: Alkoholowe trunki to moje ładunki :beer:"

//LEAN messsages
const leanmessage_array=[];
leanmessage_array[0]=":grapes: LEAN LEAN LUBIE PIĆ LEAN :grapes:"
leanmessage_array[1]=":grapes: LEAN pić musze bo sie udusze :grapes:"
leanmessage_array[2]=":grapes: Boże jak ja uwielbiam LEAN :grapes:"

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
      var rand_msg_id=(getRandomInt(0,piwomessage_array.length));
      console.log(
        // Console log for bot host
        `Did someone say [piwo]? \nPIWO counter: ${piwocounter}`
      );

      message.reply(piwomessage_array[rand_msg_id])
      .then(() => message.react('🍺'));
    }

    if (message.content.toLowerCase().includes("lean")) {
      var rand_msg_id=(getRandomInt(0,leanmessage_array.length));
      console.log(
        // Console log for bot host
        `Did someone say [lean]?`
      );

      message.reply(leanmessage_array[rand_msg_id])
      .then(() => message.react('🍇'));
    }
});

client.login(token);

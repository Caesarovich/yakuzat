/* 
  ||||||||||||||||||||||||
  |||  Bot Yakuzat     |||
  |||  By Caesarovich  |||
  ||||||||||||||||||||||||
*/

console.log('[Yakuzat] Loading...');


const HTTPS = require('https');
const Discord = require('discord.js');
const TMI = require('tmi.js');
const fs = require('fs');


const Settings = JSON.parse(fs.readFileSync('settings.json'));
console.log('[Yakuzat] Loaded Settings.');

const DiscordClient = new Discord.Client();
const TwitchClient = new TMI.client(Settings.Twitch.ClientOptions);


// Divers


function ArrayRandom(array){
  return array[Math.random() * array.length | 0];
}





///////// Twitch /////////


// Commands

const TwitchCommands = {
  help: {
    func: (channel, userstate, args) => {
      TwitchClient.say(channel, 'Je suis Yakuzat, mes commandes sont: [!help], [!discord], [!crew], [!youtube], [!facebook]');
    },
  },
  
  discord: {
    func: (channel, userstate, args) => {
      TwitchClient.say(channel, 'Vous pouvez rejoindre le serveur Discord de la Yakuza Family ici: https://discord.gg/kEc7hne');
    }
  },

  crew: {
    func: (channel, userstate, args) => {
      TwitchClient.say(channel, 'Rejoignez le Crew Yakuza Family --> https://fr.socialclub.rockstargames.com/crew/yakuza_team/wall');
    }
  },

  youtube: {
    func: (channel, userstate, args) => {
      TwitchClient.say(channel, 'La Yakuza Family sur YouTube: https://www.youtube.com/channel/UCmf_aVnK7gmhlrEx6CYTGMA');
    }
  },

  facebook: {
    func: (channel, userstate, args) => {
      TwitchClient.say(channel, 'La Yakuza Family sur Facebook: https://www.facebook.com/Yakonizuka/');
    }
  }
}


// Functions

function logToDiscord(channel, userstate, message){
  // HTTPS.get('https://api.twitch.tv/helix/users?id=44322889', (res) => {
  //   res.on('data', (data) => {
  //     console.log(JSON.parse(data))
  //   });
  // });

  var message = new Discord.RichEmbed()
    .setColor(userstate.color)
    .setTitle(message)
    .setAuthor(userstate['display-name'], '','https://www.twitch.tv/' + userstate.username)  
    .setFooter('Twitch • ' + Settings.Twitch.FancyName[channel], Settings.Twitch.FancyImage[channel])
    
  twitchChannel.send(message);
}


function TwitchCommandHandler(channel, userstate, args) {
  for (var index in TwitchCommands) {  // Iterates trough commands
    if (args[0] == index){  // Find matching command or alias
      TwitchCommands[index].func(channel, userstate, args);  // Executes the command's function
      return;
    }
  };
}


function onTwitchMessage(channel, userstate, message, self){
  console.log('[Twitch] ' + userstate.username + ' >> ' + message);  // Logging

  logToDiscord(channel.replace('#', ''), userstate, message);

  if (self) return;


  // Commands

  if(message.substring(0, Settings.Twitch.CommandPrefix.length) != Settings.Twitch.CommandPrefix){return;}  // Check for prefix.
  var args = message.split(' ');  // Split the messages in arguments
  args[0] = args[0].replace(Settings.Twitch.CommandPrefix, '');  // Strip the prefix as we don't need it now 
  TwitchCommandHandler(channel, userstate, args);  // Pass to the handler
}


// Events


TwitchClient.on('message', onTwitchMessage);


TwitchClient.on('connected', () => {
  console.log('[Twitch] Connected');
});


// Launching

TwitchClient.connect();










///////// Discord  /////////


var _guild;
var welcomeChannel;
var twitchChannel;



const welcomes = [
  (member) => {
    return '**Bienvenue à ' + member + ' ^^ !**';
  },
  (member) => {
    return '**Bienvenue sur la __Yakuza Family__ ' + member + ' !**';
  },
  (member) => {
    return '**Vas-y entre, fais comme chez toi ' + member + ' !**';
  },
  (member) => {
    return ':cowboy:  **Bienvenue au saloon ' + member + ' !**';
  },
  (member) => {
    return '**' + member + ' arrive en renfort !**';
  },
  (member) => {
    return '**Te voilà dans la famille ' + member + ' !**';
  },
  (member) => {
    return '**Installe toi ' + member + ' !**';
  },
]

const activities = [
  () => {
    return '> Utilisateurs: ' + DiscordClient.users.size
  },
  () => {
    return '`!help` liste des commandes'
  },
  () => {
    return '>Yakuza Family<'
  },
  () => {
    return 'Tous les jours en live !'
  },
]

// Commands

const DiscordCommands = {
  help: {
    cmd: 'help',
    aliases: ['h'],
    description: 'Montre la liste des commandes',

    func: (msg, args) => {
      if (args.length < 2){
        var message = new Discord.RichEmbed()
          .setTitle('**Liste des commandes:**')
          .setDescription('Salut je suis Yakuzat, le bot de la Yakuza Family ! Voici mes commandes:')
          .setColor('#21e9de')
          .setThumbnail(DiscordClient.user.displayAvatarURL)
          .setFooter('Créé par ' + DiscordClient.users.get('191257958431195146').tag, DiscordClient.users.get('191257958431195146').displayAvatarURL);
          message['fields'] = makeHelpFields()

        msg.channel.send(message);
      } else {

      }
    },
  },

  twitch: {
    cmd: 'twitch',
    aliases: [],
    description: 'Donne le lien de la chaîne twitch.',

    func: (msg, args) => {
      var message = new Discord.RichEmbed()
        .setColor('#950ae6')
        .setTitle('Twitch: Yakuza Family')
        .setDescription('Tous les soirs en live !')
        .setURL('https://www.twitch.tv/yakuza_family')

      msg.channel.send(message);
    }
  },

  youtube: {
    cmd: 'youtube',
    aliases: ['yt', 'ytb'],
    description: 'Donne le lien de la chaîne YouTube.',

    func: (msg, args) => {
      var message = new Discord.RichEmbed()
        .setColor('#ff2222')
        .setTitle('Youtube: Yakuza Family')
        .setDescription('Abonnez-vous !')
        .setURL('https://www.youtube.com/channel/UCmf_aVnK7gmhlrEx6CYTGMA')

      msg.channel.send(message);
    }
  },

  facebook: {
    cmd: 'facebook',
    aliases: ['fb'],
    description: 'Donne le lien de la page Facebook.',

    func: (msg, args) => {
      var message = new Discord.RichEmbed()
        .setColor('#2222ff')
        .setTitle('Facebook: Yakuza Family')
        .setDescription('Suivez-vous !')
        .setURL('https://www.facebook.com/Yakonizuka/')

      msg.channel.send(message);
    }
  },

  donate: {
    cmd: 'donation',
    aliases: ['don', 'tip'],
    description: 'Donne le lien des donations.',

    func: (msg, args) => {
      var message = new Discord.RichEmbed()
        .setColor('#55ee55')
        .setTitle('Faire un don.')
        .setDescription('C\'est important pour nous merci ! <3')
        .setURL('https://streamelements.com/yakuza_family/tip')
        

      msg.channel.send(message);
    }
  },

  aide: {
    cmd: 'aide',
    aliases: [],
    description: 'Fais appels aux modérateurs.',

    func: (msg, args) => {
      msg.channel.send('<@&644159006880825344> <@&643856101716000768> Quelqu\'un a besoin d\'aide !');
    },
  },

  bug: {
    cmd: 'bug',
    aliases: ['technicien'],
    description: 'Fais appel au technicien !',

    func: (msg, args) => {
      msg.channel.send('<@&644156187478327353> Un bug a été signalé !');
    }
  },



  // test: {
  //   cmd: 'test',
  //   aliases: ['t'],
  //   description: 'Une commande réservée au technicien pour ses tests',

  //   func: (msg, args) => {
  //     msg.reply(msg.member.user.displayAvatarURL);
  //   }
  // }
};


// Functions

function makeHelpFields(){
  var fields = [];

  for (var index in DiscordCommands) {
    var command = DiscordCommands[index];
    fields.push({
      name: Settings.Discord.CommandPrefix + command.cmd,
      value: command.description
    });
  }
  return fields;
}



function DiscordCommandHandler(msg, args) {
  for (var index in DiscordCommands) {  // Iterates trough commands
    var command = DiscordCommands[index];
    if (args[0] == command.cmd || command.aliases.includes(args[0])){  // Find matching command or alias
      command.func(msg, args);  // Executes the command's function
      return;
    }
  };
}


function MemberJoin(member) {
  welcomeChannel.send(ArrayRandom(welcomes)(member));
  member.send('Salut moi c\'est Yakuzat. Je suis le bot de la **Yakuza Family**. Avant toutes choses penses à __lire les règles du serveur__ et à choisir tes *roles* dans le salon approprié.');
  member.send('Pour voir la liste de mes commandes fais `'+ Settings.Discord.CommandPrefix + 'help`.');
}

function Memberleave(member) {
  welcomeChannel.send('Bye bye **' + member.displayName + '**  :wave:');
}


// Events



DiscordClient.on('message', (message) => {
  if (message.member.user == DiscordClient.user) return;
  console.log('[Discord] (' + message.channel.name + ') ' + message.author.username + ' >> ' + message.content);
  if(message.content.substring(0, Settings.Discord.CommandPrefix.length) != Settings.Discord.CommandPrefix){return;}  // Check for prefix.
  var args = message.content.split(' ');  // Split the messages in arguments
  args[0] = args[0].replace(Settings.Discord.CommandPrefix, '');  // Strip the prefix as we don't need it now 
  DiscordCommandHandler(message, args);  // Pass to the handler
});

DiscordClient.on('messageUpdate', (message) => {
  if (message.member.user == DiscordClient.user) return;
  console.log('[Discord] (' + message.channel.name + ') ' + message.author.username + ' Updated >> ' + message.content);
  if(message.content.substring(0, Settings.Discord.CommandPrefix.length) != Settings.Discord.CommandPrefix){return;}  // Check for prefix.
  var args = message.content.split(' ');  // Split the messages in arguments
  args[0] = args[0].replace(Settings.Discord.CommandPrefix, '');  // Strip the prefix as we don't need it now 
  DiscordCommandHandler(message, args);  // Pass to the handler
});  


DiscordClient.on('guildMemberAdd', MemberJoin);

DiscordClient.on('guildMemberRemove', Memberleave);

DiscordClient.on('ready', () => {
  console.log('[Discord] Logged in as ' + DiscordClient.user.username);
  DiscordClient.user.setActivity('Lancement...');


  _guild = DiscordClient.guilds.get('635790111375622144');
  welcomeChannel = DiscordClient.channels.get(Settings.Discord.WelcomeChannelID);
  twitchChannel = DiscordClient.channels.get(Settings.Discord.TwitchChannelID);

});



// Launching

DiscordClient.login(Settings.Discord.BotToken);


setInterval(
  () => {
    DiscordClient.user.setActivity(ArrayRandom(activities)());
  },
  15 * 1000
)ength) != Settings.Discord.CommandPrefix){return;}  // Check for prefix.
  var args = message.content.split(' ');  // Split the messages in arguments
  args[0] = args[0].replace(Settings.Discord.CommandPrefix, '');  // Strip the prefix as we don't need it now 
  DiscordCommandHandler(message, args);  // Pass to the handler
});  


DiscordClient.on('guildMemberAdd', MemberJoin);

DiscordClient.on('guildMemberRemove', Memberleave);

DiscordClient.on('ready', () =
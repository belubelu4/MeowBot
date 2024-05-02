module.exports = {
   TOKEN: process.env.TOKEN,
   ownerID: ["677857271530651649", ""],
   botInvite: "",
   supportServer: "",
   mongodbURL: "mongodb+srv://shiva:shiva@musicbotyt.ouljywv.mongodb.net/?retryWrites=true&w=majority",
   status: 'RyoKr',
   commandsDir: './commands',
   language: "en",
   embedColor: "ff4400",
   errorLog: "",

   voteManager: {
      status: false,
      api_key: "",
      vote_commands: ["back", "channel", "clear", "dj", "filter", "loop", "nowplaying", "pause", "playnormal", "playlist", "queue", "resume", "save", "play", "skip", "stop", "time", "volume"],
      vote_url: "",
   },

   shardManager: {
      shardStatus: false
   },

   playlistSettings: {
      maxPlaylist: 100,
      maxMusic: 2400,
   },

   opt: {
      DJ: {
         commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume', 'shuffle']
      },

      voiceConfig: {
         leaveOnFinish: false,
         leaveOnStop: false,
         leaveOnEmpty: {
            status: false,
            cooldown: 30,
         },

      },

      maxVol: 150,

   }
}

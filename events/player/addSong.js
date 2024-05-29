module.exports = async (client, queue, song) => {
   if (queue) {
      if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return

      if (queue.textChannel) {
         const { EmbedBuilder } = require("discord.js")

         const embed = new EmbedBuilder()
            .setAuthor({
               name: 'Added To Queue',
               iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157218651179597884/1213-verified.gif?ex=6517cf5a&is=65167dda&hm=bc8fb4414cb412587ade0af285b77569d2568214cf7d6baab8702ddeb6c38ad5&',
            })
            .setDescription(`**[${song.name}](${song.url})**`)
            .setColor(client.config.embedColor)
            .setFooter({
               text: `🌱 • ${song.user.tag}`,
               iconURL: song.user.avatarURL(),
            })
            .setTimestamp()

         queue.textChannel
            .send({ embeds: [embed] })
            .catch(e => { console.log('❌    Add song error\n' + e) })
      }
   }
}
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')

module.exports = async (client, queue, song) => {
   if (queue) {
      if (queue.repeatMode !== 0) return

      if (queue.textChannel) {
         const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setThumbnail(queue.songs[0].thumbnail)
            .setAuthor({
               name: 'Now Playing • 🍕',
               iconURL: client.config.guildIcon,
            })
            .setDescription(`**[${song.name}](${song.url})**`)
            .addFields(
               { name: 'Duration', value: `${song.formattedDuration}`, inline: true },
               { name: 'Author', value: `${song.uploader.name}`, inline: true }
            )
            .setFooter({
               text: `🌱 ⬪ ${song.user.tag} ⬪ ${getTimestamp()}`,
               iconURL: song.user.avatarURL(),
            })

         const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Shuffle').setStyle('Secondary').setCustomId('playerShuffle'),
            new ButtonBuilder().setLabel('Previous').setStyle('Secondary').setCustomId('playerPrevious'),
            new ButtonBuilder().setLabel('Stop').setStyle('Danger').setCustomId('playerStop'),
            new ButtonBuilder().setLabel('Skip').setStyle('Secondary').setCustomId('playerSkip'),
            new ButtonBuilder().setLabel('Loop').setStyle('Secondary').setCustomId('playerLoop')
         )

         const currentMessage = await queue.textChannel.send({ embeds: [embed], components: [buttons] }).catch((e) => {
            console.log('❌    Sending message error\n' + e)
         })

         const collector = currentMessage.createMessageComponentCollector()

         collector.on('collect', async (btnInteraction) => {
            const queue = client.player.getQueue(client.config.guildID)

            if (!queue || !queue.playing) {
               await btnInteraction.reply({ content: 'No music playing', ephemeral: true }).catch((e) => {
                  console.log('❌    Reply error\n' + e)
               })
               return
            }

            const embed = EmbedBuilder.from(currentMessage.embeds[0])

            switch (btnInteraction.customId) {
               case 'playerShuffle':
                  await queue.shuffle()

                  embed.setFooter({
                     text: `🌱 ⬪ Shuffled ⬪ ${song.user.tag} ⬪ ${getTimestamp()}`,
                     iconURL: song.user.avatarURL(),
                  })

                  updateEmbed(btnInteraction, currentMessage, embed)

                  break

               case 'playerPrevious':
                  await queue.previous().catch((e) => {
                     embed.setFooter({
                        text: `🌸 ⬪ No previous ⬪ ${song.user.tag} ⬪ ${getTimestamp()}`,
                        iconURL: song.user.avatarURL(),
                     })

                     updateEmbed(btnInteraction, currentMessage, embed)
                  })
                  break

               case 'playerStop':
                  await queue.stop().catch((e) => {
                     console.log('❌    Stop error\n' + e)
                  })
                  currentMessage.delete().catch((e) => console.log('PS Stop\n' + e))
                  break

               case 'playerSkip':
                  await queue.skip().catch((e) => {
                     embed.setFooter({
                        text: `🌸 ⬪ No song ⬪ ${song.user.tag} ⬪ ${getTimestamp()}`,
                        iconURL: song.user.avatarURL(),
                     })

                     updateEmbed(btnInteraction, currentMessage, embed)
                  })
                  break

               case 'playerLoop':
                  const isLooping = queue.repeatMode === 2
                  queue.setRepeatMode(isLooping ? 0 : 2)

                  const loopStatus = isLooping ? 'Loop off' : 'Looping'

                  embed.setFooter({
                     text: `🌱 ⬪ ${loopStatus} ⬪ ${song.user.tag} ⬪ ${getTimestamp()}`,
                     iconURL: song.user.avatarURL(),
                  })

                  updateEmbed(btnInteraction, currentMessage, embed)
                  break
            }
         })
         queue.lastPlayingMessage = currentMessage
      }
   }
}

function getTimestamp() {
   const time = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Bangkok',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
   })
   return `Today at ${time}`
}

async function updateEmbed(btnInteraction, currentMessage, embed) {
   await currentMessage.edit({ embeds: [embed] }).catch((e) => {
      console.log('❌    Edit message error\n' + e)
   })

   await btnInteraction.deferUpdate().catch((e) => {
      console.log('❌    Defer update error\n' + e)
   })
}

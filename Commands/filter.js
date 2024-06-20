const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')
const { capFirstChar, deleteMessage } = require('../Function')

module.exports = {
   name: 'filter',
   description: 'Modify filters',
   permissions: '0x0000000000000800',
   voiceChannel: true,

   run: async (client, interaction) => {
      try {
         const queue = client.player.getQueue(interaction.guild.id)
         const embed = new EmbedBuilder()
            .setColor(client.config.player.embedColor)
            //.setThumbnail(client.config.player.embedGif)
            .setFooter({ text: `🧩 • ${capFirstChar(interaction.user.globalName)}`, iconURL: interaction.user.avatarURL() })
            .setTimestamp()

         if (!queue || !queue.playing) {
            embed.setDescription('No music playing')
            deleteMessage(await interaction.reply({ embeds: [embed] }), 10000)
            return
         }

         const filterState = (filter) => (queue.filters.has(filter) ? 'On' : 'Off')
         const description = () =>
            `\`\`\`3D・${filterState('3d')}\n` +
            `Stereo・${filterState('haas')}\n` +
            `Slowed・${filterState('vaporwave')}\n` +
            `Nightcore・${filterState('nightcore')}\`\`\``

         embed.setAuthor({ name: '─────・ F I L T E R S ❤️‍🔥・─────', iconURL: interaction.guild.iconURL() }).setDescription(description())

         const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('3d').setLabel('3D').setStyle('Secondary'),
            new ButtonBuilder().setCustomId('haas').setLabel('Stereo').setStyle('Secondary'),
            new ButtonBuilder().setCustomId('vaporwave').setLabel('Slowed').setStyle('Secondary'),
            new ButtonBuilder().setCustomId('nightcore').setLabel('Nightcore').setStyle('Secondary'),
            new ButtonBuilder().setCustomId('close').setLabel('Close').setStyle('Danger')
         )

         const message = await interaction.reply({ embeds: [embed], components: [row] })
         const filter = (i) => i.user.id === interaction.user.id
         const collector = message.createMessageComponentCollector({ filter, time: 120000 })

         collector.on('collect', async (button) => {
            if (button.customId === 'close' || !['3d', 'haas', 'vaporwave', 'nightcore'].includes(button.customId)) {
               collector.stop()
               return
            }

            const filter = button.customId
            queue.filters.has(filter) ? queue.filters.remove(filter) : queue.filters.add(filter)

            embed.setDescription(description())

            await button.deferUpdate()
            await interaction.editReply({ embeds: [embed], components: [row] })
         })

         collector.on('end', async () => {
            deleteMessage(message, 100)
         })
      } catch (e) {
         console.error('❌    Filter Error')
      }
   }
}
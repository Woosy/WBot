// ===========================================================
// == Chargement des modules
// ===========================================================

const Discord = require('discord.js')
const moment = require('moment')
require('moment-duration-format')
const packageJson = require('../../../package.json')



// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande stats :
 * affiche diverses informations sur le bot
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * Récupération nombre de devoirs
   * (- sur le serveur)
   * (- tout serveurs confondus)
   */
  wbot.database.query(`SELECT COUNT(*) AS total, SUM(case when serveur_discord_id = '${message.guild.id}' then 1 else 0 end) AS server FROM devoir`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Récupération et formatage de l'uptime
    const duration = moment.duration(wbot.uptime).format(' D [jour], H [h] et m [minute], s [s]')
    const nbDevoirs = rows[0].server || 0

    var desc = ''
    desc += '**`' + wbot.beautify('Version du bot', 20) + '`** : v' + packageJson.version + '\n'
    desc += '**`' + wbot.beautify('Version discordjs', 20) + '`** : v' + packageJson.dependencies['discord.js'] + '\n'
    desc += '**`' + wbot.beautify('Version nodejs', 20) + '`** : ' + process.version + '\n'
    desc += '**`' + wbot.beautify('Code source', 20) + '`** : [Woosy/WBot](https://github.com/Woosy/WBot) \n'
    desc += '---------------------------\n'
    desc += '**`' + wbot.beautify('Uptime', 20) + '`** : ' + duration + '\n'
    desc += '**`' + wbot.beautify('Utilisation mémoire', 20) + '`** : ' + (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB\n'
    desc += '---------------------------\n'
    desc += '**`' + wbot.beautify('Serveurs', 20) + '`** : ' + wbot.guilds.size + '\n'
    desc += '**`' + wbot.beautify('Channels', 20) + '`** : ' + wbot.channels.size + '\n'
    desc += '**`' + wbot.beautify('Utilisateurs', 20) + '`** : ' + wbot.users.size + '\n'
    desc += '---------------------------\n'
    desc += '**`' + wbot.beautify('Nb devoirs serveur', 20) + '`** : ' + nbDevoirs + '\n'
    desc += '**`' + wbot.beautify('Nb devoirs totaux', 20) + '`** : ' + rows[0].total + '\n'

    // Construction de la réponse
    const embed = new Discord.RichEmbed()
      .setColor('#3586ff')
      .setAuthor(wbot.user.username, wbot.user.avatarURL)
      .setTitle('Informations :')
      .setDescription(desc)
      .setFooter(message.author.username, message.author.avatarURL)
      .setTimestamp()

    // Envoi
    message.channel.send(embed)
  })
}



/**
 * Niveau de permission
 */
module.exports.conf = {
  permission: 0
}



/**
 * Propriétés de la commande
 */
module.exports.help = {
  aliases: ['stats', 'bot', 'src'],
  name: 'info',
  shortDesc: 'Affiche diverses informations du bot',
  longDesc: `La commande info vous permet d'obtenir des informations (principalement techniques) sur le bot. Vous pouvez ainsi surveiller le fait qu'il soit à jour, ou bien avoir une idée du nombre de personnes qui l'utilisent.`,
  usage: 'info',
  example: 'info'
}

// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande devoirs :
 * affiche les devoirs à
 * faire en fonction du serveur
 */
module.exports.run = async (wbot, message, args) => {
  Promise.all([
    wbot.getEmbedDevoirs('message', message)
  ]).then(function (response) {
    wbot.database.query(`SELECT serveur_channel_devoirs FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')
      message.channel.send(response[0])
    })
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
  aliases: ['dev', 'd'],
  name: 'devoirs',
  shortDesc: 'Affiche la liste des des devoirs à venir',
  longDesc: `Cette commande permet d'afficher les devoirs à venir en fonction de leur date. Pour ajout des devoirs, executez la commande \`!da\` (voir \`!h da\`).`,
  usage: 'devoirs',
  example: 'devoirs'
}

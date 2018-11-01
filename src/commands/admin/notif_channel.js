// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande version :
 * affiche la version actuelle du bot
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * Longueur argument invalide
   */
  if (args.length !== 0 && args.length !== 1) {
    wbot.errors.errorWrongUsage(wbot, this.help.name, message)
    return
  }


  /**
   * 0 argument - affichage du channel
   */
  if (args.length === 0) {
    wbot.database.query(`SELECT serveur_channel_notif FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
      if (err) wbot.logger.log(err, 'error')

      const channelName = rows[0].serveur_channel_notif
      // Vérification channel set ou non-set
      if (channelName) {
        wbot.sendSuccess(message, `Le channel défini est : **#${channelName}**`)
      } else {
        wbot.errors.channelNotDef(wbot, message, 'notifications')
      }
    })
    return
  }


  /**
   * Si le channel n'existe pas
   */
  if (message.guild.channels.some(val => val.name === args[0]) === false) {
    wbot.errors.channelNotFound(wbot, message, args[0])
    return
  }


  /**
   * 1 argument - insertion du nouveau channel
   */
  // Récupération de l'id du channel
  // Insertion
  wbot.database.query(`UPDATE serveur SET serveur_channel_notif = '${args[0]}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Message de succès
    wbot.sendSuccess(message, `Les notifications s'afficheront désormais dans le channel : **${args[0]}**`)
  })
}



/**
 * Niveau de permission
 */
module.exports.conf = {
  permission: 10
}



/**
 * Propriétés de la commande
 */
module.exports.help = {
  aliases: ['n_channel', 'notif_chan', 'n_chan', 'n_c', 'nc'],
  name: 'notif_channel',
  shortDesc: 'Affiche / défini le channel où envoyer les rappels',
  longDesc: `Cette commande permet de définir le channel dans lequel afficher les notifications de rappel de devoirs, ou bien de l'afficher si le channel est déjà défini.`,
  usage: 'notif_channel [nomDuChannel]',
  example: 'nc notifications'
}

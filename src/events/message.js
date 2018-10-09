/**
* Code appelé lors que l'event "message" est triggered :
* (lancement des commandes)
*/
module.exports = (wbot, message) => {
  // Ne prend pas en charge les msgs d'autres bots
  if (message.author.bot) return

  // Ne prend pas en charge les msgs privés
  if (message.guild === null) {
    wbot.errors.directMessage(wbot, message)
    return
  }

  // Récupère le prefixe pour le serveur
  wbot.database.query(`SELECT serveur_prefix FROM serveur WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Prefix
    const prefix = rows[0].serveur_prefix || '!'


    // (Au cas où l'on oublie le prefix)
    if (message.content === 'WBot') {
      message.channel.send('Le préfixe est : ' + prefix)
    }


    // On ne traite pas les messages qui ne sont pas des commandes (pour l'instant)
    if (message.content.substring(0, prefix.length) !== prefix) return


    // On sépare les différents éléments du message
    const messageArray = message.content.split(' ')
    const cmd = messageArray[0]
    const args = messageArray.slice(1)


    /**
    * Chargement des commandes :
    */
    let commandFile = wbot.commands.get(cmd.slice(prefix.length))

    if (!commandFile) {
      wbot.errors.commandNotFound(wbot, message, cmd)
      return
    }


    /**
    * Aucune permission requise
    */
    if (commandFile.conf.permission === 0) {
      // Exécution de la commande
      commandFile.run(wbot, message, args)
      // Log l'utilisation de la commande
      wbot.logger.log(message.author.tag + ' a executé la commande : ' + cmd + ' (' + message.guild.name + ')', 'info')
    } else


    /**
    * Permission admin
    */
    if (commandFile.conf.permission === 10) {
      // On récupère l'id du role admin
      wbot.database.query(`SELECT serveur_role_admin_id FROM server WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
        if (err) wbot.logger.log(err, 'error')

        if (message.member.roles.find('id', rows[0].serveur_role_admin_id) || message.author === message.guild.owner.client) {
          // Exécution de la commande
          commandFile.run(wbot, message, args)
          // Log l'utilisation de la commande
          wbot.logger.log(message.author.tag + ' a executé la commande : ' + cmd + ' (' + message.guild.name + ')', 'info')
        } else {
          wbot.errors.noPerm(wbot, message)
        }
      })
    } else


    /**
    * Permission owner du serveur
    */
    if (commandFile.conf.permission === 100) {
      if (message.author.id === message.guild.owner.id) {
        // Exécution de la commande
        commandFile.run(wbot, message, args)
        // Log l'utilisation de la commande
        wbot.logger.log(message.author.tag + ' a executé la commande : ' + cmd + ' (' + message.guild.name + ')', 'info')
      } else {
        wbot.errors.noPerm(wbot, message)
      }
    }
  })
}

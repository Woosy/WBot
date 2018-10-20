// ===========================================================
// == Execution de la commande
// ===========================================================

/**
 * Commande admin_role :
 * (défini le role aillant la permission d'effectuer
 * les commandes marquées "administrateur")
 */
module.exports.run = async (wbot, message, args) => {
  /**
   * Longueur argument invalide
   */
  if (args.length !== 1) {
    wbot.errors.errorWrongUsage(wbot, this.help.name, message)
    return
  }


  /**
   * Si le role n'existe pas
   */
  if (message.guild.roles.some(val => val.name === args[0]) === false) {
    wbot.errors.roleNotFound(wbot, message, args[0])
    return
  }


  // Insértion du nouveau role
  wbot.database.query(`UPDATE serveur SET serveur_role_admin = '${args[0]}' WHERE serveur_discord_id = '${message.guild.id}'`, function (err, rows, fields) {
    if (err) wbot.logger.log(err, 'error')

    // Message de succès
    wbot.sendSuccess(message, 'Le rôle : **' + args[0] + '** a désormais les droits d\'administrateur')
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
  aliases: ['a_role', 'admin_r', 'ar'],
  name: 'admin_role',
  shortDesc: 'Défini le rôle aillant les droits d\'admin',
  longDesc: 'Cette commande permet de définir le rôle aillant les droits d\'administrateur. Toutes les personnes possédant ce rôle aura donc le droit d\'utiliser les commandes "administrateur".',
  usage: 'admin_role <nomDuRole>',
  example: 'admin_role Administrateur'
}

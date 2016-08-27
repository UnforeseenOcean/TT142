var Discord = require("discord.js");
var ping = require("ping");
var mysql = require('mysql');
var fs = require("fs")
var socialblade = require('socialblade-data');
fs.readFile("/auth.json", function(err, data) {
  console.log(data)
sqlconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: JSON.parse(data).sql,
  database: 'discord'
});
sqlconnection.connect();
var mybot = new Discord.Client();
CHANNEL_TO_LISTEN = "null"
mybot.on("ready", function() {
  mybot.sendMessage('108892284119977984', "I've been restarted! o.O")
  mybot.on("message", function(message) {
    // console.log(mybot.servers.get("id", ))
    //Fml
    if (message.author.id !== "207528679931248640") {
      if (message.server) {
        var SERVER_ID = message.server.id
        sqlconnection.query("SELECT * FROM blacklist WHERE team_id=" + sqlconnection.escape(SERVER_ID) + ";", function(erro, rowso, fieldso) {
          sqlconnection.query("SELECT * FROM commands WHERE team_id='" + message.server.id + "'", function(err, rows, fields) {
            var BLACK = false

            for (var BLO = 0; BLO < rowso.length; BLO++) {
              if (message.author.id === rowso[BLO].user && message.content.charAt(0) === "=") {
                BLACK = true;
                mybot.sendMessage(message, "I'm sorry, " + message.author.name + " but you have been blacklisted!\n```You have been blacklisted by " + mybot.users.get("id", rowso[BLO].admin).name + " and can therefore not use this bot.```")
              }
            }
            if (BLACK === false) {
              if (message.content === "=ping") {
                mybot.reply(message, "pong!")
              } else if (message.content === "=help") {
                mybot.sendMessage(message, "Hello! My name is TT142. I am a bot designed for the scammer sub lounge!\n```Version 0.2-Dev\nCommands: ping, status, help, new, delete, edit, summon, playing, blacklist, whitelist, protect, add, list, nick, source, raw\nPrefix: =\nFor further information about a command, type '=help <command>'```")
              } else if (message.content.split(" ")[0] === "=help") {
                var cmd = message.content.split(" ")[1]
                if (cmd === "ping") {
                  mybot.reply(message, "Testing command. If all is well, I should respond with pong.\n```Usage: =ping```")
                } else if (cmd === "help") {
                  mybot.reply(message, "help will display the help message.\n```Usage: =help```")
                } else if (cmd === "status") {
                  mybot.reply(message, "check to see if a website is up.\n```Usage: =status <IP/domain>```")
                } else if (cmd === "new") {
                  mybot.reply(message, "Create a new custom command.\n```Usage: =new <command_name> <Response>\nExtra info: You can add multiple responses (a random one will be picked) by seperating them with '~'.\nPerms required: manageMessages or manageServer```")
                } else if (cmd === "delete") {
                  mybot.reply(message, "Delete a custom command.\n```Usage: =delete <command_name>\nPerms required: manageMessages or manageServer```")
                } else if (cmd === "lmeme") {
                  mybot.reply(message, "For all your daily fresh-lewis-meme needs.\n```Usage: =lmeme```")
                } else if (cmd === "source") {
                  mybot.reply(message, "Check out my source code!\n```Usage: =source```")
                } else if (cmd === "edit") {
                  mybot.reply(message, "Edit a custom command.\n```Usage: =edit <command_name> <Response(s)>\nPerms required: manageMessages or manageServer```")
                } else if (cmd === "playing") {
                  mybot.reply(message, "Sets the bot playing game.\n```Usage: =playing <game>\nPerms required: manageServer or manageRoles```")
                } else if (cmd === "list") {
                  mybot.reply(message, "Get a list of the custom commands on thsi server.\n```Usage: =list```")
                } else if (cmd === "blacklist") {
                  mybot.reply(message, "Blacklist a person, this person will not be able to use the bot anymore.\n```Usage: =blacklist <username>\nPerms required: manageRoles or manageServer```")
                } else if (cmd === "add") {
                  mybot.reply(message, "Add another response to a command.\n```Usage: =add <cmd> <response>\nPerms required: manageMessages or manageServer```")
                } else if (cmd === "raw") {
                  mybot.reply(message, "See a command 'raw', all responses without text decoration.\n```Usage: =raw <command>```")
                } else if (cmd === "nick") {
                  mybot.reply(message, "Change the bot's nickname.\n```Usage: =nick <nickname>\nPerms required: 'manageRoles' or 'manageServer'```")
                } else if (cmd === "whitelist") {
                  mybot.reply(message, "Remove a user from the blacklist.\n```Usage: =whitelist <username>\nPerms required: manageRoles or manageServer```")
                } else if (cmd === "summon") {
                  mybot.reply(message, "Summon the bot to your current voice channel.\n```Usage: =summon\nPerms required: manageRoles or manageServer```")
                } else if (cmd === "protect") {
                  mybot.reply(message, "Protect a command. A protected command can not be removed by users who do not have the manageRoles or manageServer perms.\n```Usage: =protect <command>\nPerms required: manageRoles or manageServer```")
                } else {
                  mybot.reply(message, "I'm sorry, but " + cmd + " is not a command!")
                }
              } else if (message.content.split(" ")[0] === "=status") {
                var host = message.content.split(" ")[1]
                ping.sys.probe(host, function(isAlive) {
                  var msg = isAlive ? 'Host ' + host + ' appears to be alive, and quite annoying. Do not let me go back there again! (Alive)' : "I gave up while waiting for " + host + '. Tell him to hurry up next time! I do not have a lot of patience. (Timeout)';
                  mybot.sendMessage(message, msg)
                });
              } else if (message.content === "=new") {
                mybot.sendMessage(message, "```Usage: =new <new_command> <Response(s)>```")
              } else if (message.content.split(" ")[0] === "=new") {
                if (message.channel.permissionsOf(message.author).serialise().manageMessages !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage messages' or 'manage server'!```")
                } else {
                  var MESS = message.content.split(" ")
                  console.log(MESS)
                  var ACTION = ""
                  for (var index = 2; index < MESS.length; index++) {
                    ACTION = ACTION + MESS[index] + " "
                  }
                  if (message.content.split(" ").length > 2) {
                    var DUPLICATE = false
                    for (var index = 0; index < rows.length; index++) {
                      if (MESS[1] === rows[index].cmd) {
                        DUPLICATE = true
                      }
                    }
                    if (MESS[1] === "ping" || MESS[1] === "status" || MESS[1] === "new" || MESS[1] === "help" || MESS[1] === "delete" || MESS[1] === "summon" || MESS[1] === "whitelist" || MESS[1] === "protect" || MESS[1] === "lmeme" || MESS[1] === "raw" || MESS[1] === "source" || MESS[1] === "edit" || MESS[1] === "playing" || MESS[1] === "list" || MESS[1] === "blacklist" || MESS[1] === "add" || MESS[1] === "=") {
                      mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_RESERVED\nPlease choose another command name!```")
                    } else if (DUPLICATE === true) {
                      mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_EXISTS\nPlease choose another command name!```")
                    } else {
                      console.log(ACTION.replace(/'/g, "\'"))
                      sqlconnection.query("INSERT INTO commands VALUES (" + sqlconnection.escape(MESS[1]) + "," + sqlconnection.escape(ACTION) + ",'" + message.server.id + "', 0)")
                      mybot.sendMessage(message, "Ok, command saved!")
                    }
                  } else {
                    mybot.sendMessage(message, "```Usage: =new <new_command> <Response>```")
                  }
                }
              } else if (message.content === "=delete") {
                mybot.sendMessage(message, "```Usage: =delete <command_to_delete>```")
              } else if (message.content.split(" ")[0] === "=delete") {
                console.log(message.channel.permissionsOf(message.author).serialise())
                if (message.channel.permissionsOf(message.author).serialise().manageMessages !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage messages' or 'manage server'!```")
                } else {
                  var MESO = message.content.split(" ")
                  var SUCCESS = false
                  for (var index = 0; index < rows.length; index++) {
                    if (rows[index].cmd === MESO[1]) {
                      SUCCESS = true
                      console.log(message.channel.permissionsOf(message.author).serialise().managePermissions)
                      console.log(rows[index].protect)
                      if (rows[index].protect === 1 && message.channel.permissionsOf(message.author).serialise().managePermissions === true || rows[index].protect === 0) {
                        sqlconnection.query("DELETE FROM commands WHERE team_id='" + message.server.id + "' AND cmd='" + MESO[1] + "'")
                        mybot.sendMessage(message, "The command `" + MESO[1] + "` has been deleted successfully.")
                      } else {
                        mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nThis command has been protected. You must have the 'manage roles' permission to edit this command.```")
                      }
                    }
                  }
                  if (SUCCESS === false) {
                    mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_NOT_FOUND\nThe command could not be found, check for typo's!```")
                  }
                }
              } else if (message.content.split(" ")[0] === "=lmeme") {
                var PIC = Math.floor((Math.random() * 25) + 1);
                var PICO = "null"

                console.log("waet")
                switch (PIC) {
                   case 1:
                    PICO = "https://i.gyazo.com/bf104e24628ae0e4bee2e1a35f584a27.png"
                    break;
                  case 2:
                    PICO = "https://i.gyazo.com/0462ccd5b521957404688ab6fde1f847.png"
                    break;
                  case 3:
                    PICO = "https://i.gyazo.com/975386f8ab2941cbf4fc871e9ff8bf88.png"
                    break;
                  case 4:
                    PICO = "https://i.gyazo.com/ad6ce1bb44f06fcef6d0172b5b64fee8.png"
                    break;
                  case 5:
                    PICO = "https://i.gyazo.com/291a451227858b6c7256286acaf04261.png"
                    break;
                  case 6:
                    PICO = "https://i.gyazo.com/fef405d6c984ef9faac832353119763c.png"
                    break;
                  case 7:
                    PICO = "https://i.gyazo.com/11fe5c2929bfe2af2cba9be71501dd31.png"
                    break;
                  case 8:
                    PICO = "https://i.gyazo.com/bb16258f38459a1f4bda789599ddf80b.png"
                    break;
                  case 9:
                    PICO = "https://i.gyazo.com/872330a139c48a14d6f2c106f57f688e.png"
                    break;
                  case 10:
                    PICO = "https://i.gyazo.com/3cf0064b5b08421af94a0517b14e70e2.png"
                    break;
                  case 11:
                    PICO = "https://i.gyazo.com/c58c27d2e54decaf80f0ca816de0a77b.png"
                    break;
                  case 12:
                    PICO = "https://i.gyazo.com/0f4069b3e45bd4eb9073928ef08cc064.png"
                    break;
                  case 13:
                    PICO = "https://i.gyazo.com/870aa8636094acebaa7f94a2e715fce4.png"
                    break;
                  case 14:
                    PICO = "https://i.gyazo.com/97fcf6eafe2ebb09b969c41ed691f4a8.png"
                    break;
                  case 15:
                    PICO = "https://u3.photofunia.com/2/results/c/d/cdDjypH4R8KX_MlPxQFW8w_r.gif"
                    break;
                  case 16:
                    PICO = "https://i.gyazo.com/72fdfdd5650d15045c71ee2af55bfaa9.png"
                    break;
                  case 17:
                    PICO = "https://i.gyazo.com/5ba61e54ba3fb0843ceab1d4d484db64.png"
                    break;
                  case 18:
                    PICO = "https://i.gyazo.com/7c4b888bdece0ee33d7ea16e613fb7c1.png"
                    break;
                  case 19:
                    PICO = "https://i.gyazo.com/2e80e7382c403e7db7f2a4cbd12cc0c0.png"
                    break;
                  case 20:
                    PICO = "https://i.gyazo.com/1cec2a4f400c71fb9a982bf4bf60d2d2.png"
                    break;
                  case 21:
                    PICO = "https://i.gyazo.com/0193aa4b6d0635019894988c0c194de1.png"
                    break;
                  case 22:
                    PICO = "https://i.gyazo.com/78352088b78e62f00cf24abb3bc430ca.png"
                    break;
                  case 23:
                    PICO = "http://u3.photofunia.com/1/results/q/m/qmO4ZwdGRNAxQ47BEmNR-A_r.jpg"
                    break;
                  case 24:
                    PICO = "https://i.gyazo.com/d1d26c0c0fb109a613b9eb606b6efc49.png"
                    break;
                  default:
                    PICO = "https://i.gyazo.com/67ffff888a5a3d3b54dc1816302327e1.png"

                }
                console.log(PICO)
                mybot.sendMessage(message, {
                  "file": PICO
                })
              } else if (message.content.split(" ")[0] === "=source") {
                mybot.sendMessage(message, "Here's mah *amazing* brain!", {
                  "file": "https://gilbertgobbels.xyz/dixcord/bot.js"
                })
              } else if (message.content.split(" ")[0] === "=edit") {
                if (message.channel.permissionsOf(message.author).serialise().manageMessages !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage messages' or 'manage server'!```")
                } else {
                  var MESSAGE = message.content.split(" ")
                  var A_TOSET = ""
                  for (var index = 2; index < MESSAGE.length; index++) {
                    A_TOSET = A_TOSET + MESSAGE[index] + " "
                  }
                  if (message.content.split(" ").length > 2) {
                    var FOUND = false
                    for (var i = 0; i < rows.length; i++) {
                      if (rows[i].cmd === MESSAGE[1]) {
                        FOUND = true
                      }
                    }
                    if (FOUND === true) {
                      sqlconnection.query("UPDATE commands SET action=" + sqlconnection.escape(A_TOSET) + " WHERE cmd=" + sqlconnection.escape(MESSAGE[1]) + " AND team_id=" + sqlconnection.escape(SERVER_ID) + ";")
                      mybot.sendMessage(message, "Ok, command edited!")
                    } else {
                      mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_NOT_FOUND\nThe command could not be found, check for typo's!```")
                    }
                  } else {
                    mybot.sendMessage(message, "```Usage: =edit <new_command> <Response>```")
                  }
                }
              } else if (message.content === "=playing") {
                mybot.sendMessage(message, "```Usage: =playing <game>```")
              } else if (message.content.split(" ")[0] === "=playing") {
                if (message.channel.permissionsOf(message.author).serialise().manageServer !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage roles' or 'manage server'!```")
                } else {
                  var PLAY = ""
                  for (var a = 1; a < message.content.split(" ").length; a++) {
                    PLAY = PLAY + message.content.split(" ")[a] + " "
                  }
                  mybot.sendMessage(message, ":thumbsup:")
                  mybot.setStatus("online", PLAY, function(err) {
                    console.log(err)
                  })
                }
              } else if (message.content.split(" ")[0] === "=list") {
                var LIST = ""
                for (var b = 0; b < rows.length; b++) {
                  LIST = LIST + rows[b].cmd + ", "
                }
                mybot.sendMessage(message, "These are the custom commands for this server:\n```" + LIST + "| You may delete a command using =delete```")
              } else if (message.content.split(" ")[0] === "=blacklist") {
                if (message.content.split(" ").length !== 2) {
                  mybot.sendMessage(message, "```Usage: =blacklist <username>```")
                } else {
                  var DUPLIDUPLI = false
                  console.log(rowso)
                  console.log(erro)
                  for (var c = 0; c < rowso.length; c++) {
                    if (rowso[c].user === message.content.split(" ")[1].replace("<", "").replace("@", "").replace(">", "")) {
                      DUPLIDUPLI = true
                    }
                  }
                  if (DUPLIDUPLI === false) {
                    console.log(message.content.split(" ")[1])
                    if (mybot.users.get("id", message.content.split(" ")[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) === null) {
                      mybot.sendMessage(message, "```Woops! An error occured; BLACKLIST_USER_NOT_FOUND\nThe user could not be found.```")
                    } else {
                      sqlconnection.query("INSERT INTO blacklist VALUES (" + sqlconnection.escape(SERVER_ID) + ", " + sqlconnection.escape(message.author.id) + ", " + sqlconnection.escape(message.content.split(" ")[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) + ")")
                      mybot.sendMessage(message, "The ban hammer has spoken!\n```User " + mybot.users.get("id", message.content.split(" ")[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")).name + " has been blacklisted!```")
                    }
                  } else {
                    mybot.sendMessage(message, "```Woops! An error occured; BLACKLIST_USER_EXISTS\nThis user is already blacklisted!```")
                  }
                }
              } else if (message.content.split(" ")[0] === "=add") {
                if (message.channel.permissionsOf(message.author).serialise().manageMessages !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage messages' or 'manage server'!```")
                } else {
                  if (message.content.split(" ").length > 2) {
                    var FUND = false
                    for (var e = 0; e < rows.length; e++) {
                      if (message.content.split(" ")[1] === rows[e].cmd) {
                        FUND = e
                      }
                    }
                    if (FUND === false) {
                      mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_NOT_FOUND\nThe command does not exist. Check for typo's!```")
                    } else {
                      var UPDATE = "~"
                      for (var d = 2; d < message.content.split(" ").length; d++) {
                        UPDATE = UPDATE + message.content.split(" ")[d] + " "
                      }
                      var ADDING = rows[FUND].action + UPDATE
                      sqlconnection.query("UPDATE commands SET action=" + sqlconnection.escape(ADDING) + " WHERE team_id=" + sqlconnection.escape(SERVER_ID) + " AND cmd=" + sqlconnection.escape(message.content.split(" ")[1]) + ";")
                      mybot.sendMessage(message, "The command has been updated!")
                    }
                  } else {
                    mybot.sendMessage(message, "```Usage: =add <command> <response>```")
                  }
                }
              } else if (message.content.split(" ")[0] === "=protect") {
                if (message.content.split(" ").length > 1) {
                  if (message.channel.permissionsOf(message.author).serialise().manageServer !== true) {
                    mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage roles' or 'manage server'!```")
                  } else {
                    var EX = false
                    for (var f = 0; f < rows.length; f++) {
                      if (rows[f].cmd === message.content.split(" ")[1]) {
                        EX = f
                      }
                    }
                    if (EX === false) {
                      mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_NOT_FOUND\nThe command could not be found. Check for typo's!```")
                    } else {
                      if (rows[EX].protect === 1) {
                        mybot.sendMessage(message, "```Woops! An error occured; COMMAND_PROTECTED_POSITIVE\nThis command is already protected!```")
                      } else {
                        mybot.sendMessage(message, "The command has been protected succesfuly. Please note the following;\n```Protected commands can not be edited, updated or removed by users who do not have the 'manage roles' permission.\nOnce a command has been protected, it can not be un-protected.```")
                        sqlconnection.query("UPDATE commands SET protect=1 WHERE team_id=" + sqlconnection.escape(SERVER_ID) + " AND cmd=" + sqlconnection.escape(message.content.split(" ")[1]) + ";")
                      }
                    }
                  }

                } else {
                  mybot.sendMessage(message, "```Usage: =protect <command>```")
                }
              } else if (message.content.split(" ")[0] === "=raw") {
                if (message.content.split(" ").length === 2) {
                  var FOU = false
                  for (var g = 0; g < rows.length; g++) {
                    if (rows[g].cmd === message.content.split(" ")[1]) {
                      mybot.sendMessage(message, "```" + rows[g].action + "```")
                      FOU = true
                    }
                  }
                  if (FOU === false) {
                    mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_NOT_FOUND\nThat command does not exist. Check for typo's!```")
                  }
                } else {
                  mybot.sendMessage(message, "```Usage: =raw <command>```")
                }
              } else if (message.content.split(" ")[0] === "=nick") {
                if (message.content.split(" ").length > 1) {
                  if (message.channel.permissionsOf(message.author).serialise().manageServer !== true) {
                    mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage roles' or 'manage server'!```")
                  } else {
                    var NICK = ""
                    for (var h = 1; h < message.content.split(" ").length; h++) {
                      NICK = NICK + message.content.split(" ")[h] + " "
                    }
                    mybot.setNickname(message, NICK)
                    mybot.sendMessage(message, ":ok_hand:")
                  }

                } else {
                  mybot.sendMessage(message, "```Usage: =nick <nickname>```")
                }
              } else if (message.content.split(" ")[0] === "=whitelist") {
                if (message.channel.permissionsOf(message.author).serialise().manageServer !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage roles' or 'manage server'!```")
                } else {
                  if (message.content.split(" ").length === 2) {
                  var YAS = false
                  for (var u = 0; u < rowso.length; u++) {
                    if (rowso[u].user === message.content.split(" ")[1].replace("<", "").replace("@", "").replace(">", "")) {YAS = u}
                  }
                    if (YAS === false) {mybot.sendMessage(message, "```Woops! An error occured; BLACKLIST_USER_NOT_FOUND\nThat user is not blacklisted. Check for typo's!\nExample of username: @GG142```")}
                    else {
                      sqlconnection.query("DELETE FROM blacklist WHERE team_id="+sqlconnection.escape(SERVER_ID)+" AND user="+sqlconnection.escape(rowso[YAS].user)+";")
                      mybot.sendMessage(message, "User "+message.content.split(" ")[1]+" has been successfully removed from the blacklist.")
                    }
                  } else {mybot.sendMessage(message, "```Usage: =whitelist <username>```")}
                }
              } else if (message.content.split(" ")[0] === "=summon") {
                    if (message.channel.permissionsOf(message.author).serialise().manageServer !== true) {
                  mybot.sendMessage(message, "```Woops! An error occured; REQUIRED_PERMISSIONS_MISSING\nYou do not have permission to execute that command. Make sure you either have the permission 'manage roles' or 'manage server'!```")
                } else {
                  if (message.author.voiceChannel === null) {mybot.sendMessage(message, "```Woops! An error occured; USER_NOT_CONNECTED\nYou aren't currently in a voice channel!")} else {
                    mybot.sendMessage(message, "On my way!")
                    mybot.joinVoiceChannel(message.author.voiceChannel.id)
                  }
                }
              } else {
                for (var index = 0; index < rows.length; index++) {
                  if (message.content.split(" ")[0] === "=" + rows[index].cmd) {
                    if (rows[index].action.split("~").length === 1) {
                      mybot.sendMessage(message, rows[index].action)
                    } else {
                      console.log(rows[index].action.split("~").length)
                      var RANDOM = Math.floor((Math.random() * rows[index].action.split("~").length) + 1);
                      console.log(RANDOM)
                      for (var indexx = 0; indexx < rows[index].action.split("~").length + 1; indexx++) {
                        if (indexx === RANDOM - 1) {
                          mybot.sendMessage(message, rows[index].action.split("~")[indexx])
                        }
                      }
                    }
                  }
                }
              }
            }
          })
        })
      }
    }
  });
})

mybot.on("serverMemberUpdated", function(server, user1, user2) {
  if (server.id === "194533269180514305" && user2 !== null && user2.roles) {console.log("yese!");
                                           var SPAMMO = false
 for (var bb = 0; bb < user2.roles.length; bb++) {
   if (user2.roles[bb].id === "205409757714972672") {SPAMMO = true}
 }
if (mybot.userHasRole(user1, "205409757714972672") !== null && SPAMMO === false) {console.log("Yesuu!"); mybot.sendMessage("213094602700226562", "User `"+user1.name+"` has been put in the spammer role!")}
 else if (SPAMMO === true && mybot.userHasRole(user1, "205409757714972672") === null) {mybot.sendMessage("213094602700226562", "User `"+user1.name+"` has been removed from the spammer role!")}                                         
 }
})
mybot.on("userBanned", function(user, server) {
  if (server.id === "194533269180514305") {mybot.sendMessage("213094602700226562", "User `"+user.name+"` has been banned from SSL!\nThat's right! Show them that ban hammer!")}
})

mybot.on("serverMemberRemoved", function(server, user) {
  console.log(user)
  var FAKE = false
  mybot.getBans(server, function(error, users) { for (var cc = 0; cc < users.length; cc++) {
    if (users[cc].id === user.id) {FAKE = true}
  }
                                                if (FAKE === false) {
  if (server.id === "194533269180514305") {mybot.sendMessage("213094602700226562", "User `"+user.name+"` has left SSL.\nMaybe they've been kicked? Maybe they left the server in peace themselves.")}}})
})
mybot.on("userUnbanned", function(user, server) {
  if (server.id === "194533269180514305") {mybot.sendMessage("213094602700226562", "User `"+user.name+"` has been unbanned from SSL!\nMaybe these admins do have a heart...")}
})
mybot.on("messageDeleted", function(message, channel) {
  if (channel.server) {
  if (channel.server.id === "194533269180514305" && message !== null && message.author.bot !== true) {mybot.sendMessage("213094602700226562", "A (recent) message was deleted! It contained the following text: `"+message.content+"`\nThe message was sent by `"+message.author.name+"`.")}
}})
mybot.on("disconnected", function() {mybot.loginWithToken(JSON.parse(data).token);})
mybot.loginWithToken(JSON.parse(data).token);});
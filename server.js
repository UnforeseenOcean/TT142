var Discord = require("discord.js");
var ping = require("ping");
var mysql      = require('mysql');
 var sqlconnection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'nein',
   database : 'discord'
 });
 sqlconnection.connect();
var mybot = new Discord.Client();
CHANNEL_TO_LISTEN = "null"
mybot.on("ready", function() {
mybot.on("message", function(message) {
 // console.log(mybot.servers.get("id", ))
  console.log(message.server.roles)
  //Fml
  sqlconnection.query("SELECT * FROM commands WHERE team_id='"+message.server.id+"'", function(err, rows, fields) {
 if (message.content === "=ping") {mybot.reply(message, "pong!")}
  else if (message.content === "=help") {mybot.sendMessage(message, "Hello! My name is TT142, I am a bot designed to help the Hexxium dev team!\n```Version 0.1-Dev\nCommands: ping, status, help\nPrefix: =\nFor further information about a command, type '=help <command>'```")}
  else if (message.content.indexOf("=help") === 0) {
    var cmd = message.content.split(" ")[1]
    if (cmd === "ping") {mybot.reply(message, "Testing command. If all is well, I should respond with pong.\n```Usage: =ping```")}
    else if (cmd === "help") {mybot.reply(message, "help will display the help message.\n```Usage: =help```")}
    else if (cmd === "status") {mybot.reply(message, "check to see if a website is up.\n```Usage: =status <IP/domain>```")}
    else {mybot.reply(message, "I'm sorry, but " + cmd + " is not a command!")}
  }
  else if (message.content.indexOf("=status") === 0) {
   var host = message.content.split(" ")[1]  
   ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'Host ' + host + 'appears to be alive!' : "I'm sorry to say that host " + host + ' appears to be dead.';
        mybot.sendMessage(message, msg)
    });
   } else if (message.content === "=new") {mybot.sendMessage(message, "```Usage: =new <new_command> <Response>```")} 
  else if (message.content.indexOf("=new") === 0) {
    var MESS = message.content.split(" ")
    console.log(MESS)
    var ACTION = ""
    for(var index = 2; index < MESS.length; index++) {
      ACTION = ACTION + " " + MESS[index]
    }
     if (message.content.split(" ").length > 2) {
       var DUPLICATE = false
            for (var index = 0; index < rows.length; index++) {
              if (MESS[1] === rows[index].trigger) {DUPLICATE = true}
            }
       if (MESS[1] === "ping" || MESS[1] === "status" || MESS[1] === "new" || MESS[1] === "help" || MESS[1] === "delete") {mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_RESERVED\nPlease choose another command name!```")}
       else if (DUPLICATE === true) {mybot.sendMessage(message, "```Woops! An error occured; COMMAND_NAME_EXISTS\nPlease choose another command name!```")}
       else {
       console.log(ACTION)
       sqlconnection.query("INSERT INTO commands VALUES ('"+MESS[1]+"','"+ACTION+"','"+message.server.id+"')")
       mybot.sendMessage(message, "Ok, command saved!")
     }}
    else {mybot.sendMessage(message, "```Usage: =new <new_command> <Response>```")}
   } else if (message.content === "=delete") {
     mybot.sendMessage(message, "```Usage: =delete <command_to_delete>```")
   } else if (message.content.indexOf("=delete") === 0) {
     var MESO = message.content.split(" ")
     
   } else {
     console.log("wat")
     for (var index = 0; index < rows.length; index++) {
       console.log(rows[index].trigger)
       if(message.content.indexOf("=" + rows[index].trigger) === 0) {
         mybot.sendMessage(message, rows[index].action)
       }
     }
   } 
  
})}); })

mybot.loginWithToken("Nein");

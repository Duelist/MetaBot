var Discord = require('discord.js')

var mybot = new Discord.Client()

mybot.on('message', function(message) {
  if(message.content === 'ping') {
    mybot.reply(message, 'pong')
  }
})

mybot.loginWithToken('token')

#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config'

// discord.js import
import Discord, {
  Intents,
} from 'discord.js'

// initialize client
const client = new Discord.Client({
  intents: 534723950656,
})

// log out some info
client.on('ready', () => {
  console.info(`Logged in as ${client.user?.tag}!`)
})

// when the bot receives a message
// need async message because we are making HTTP requests
client.on('message', async message => {
  // ignore messages from the bot itself
  console.info('new message:', message)

  if (message.author.bot) {
    return
  }

  if (/^ding$/i.test(message.content)) {
    // set status to typing
    await message.channel.sendTyping()

    // send message to channel as a reply
    await message.reply('dong')
  }
})

client.login(process.env['DISCORD_TOKEN'])
  .catch(console.error)

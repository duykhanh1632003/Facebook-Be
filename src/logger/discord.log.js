"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
      this.logChannels();
    });

    this.channelId = process.env.CHANNEL_ID_DISCORD;
    const discordToken = process.env.DISCORD_TOKEN;
    this.client.login(discordToken);
  }

  logChannels() {
    this.client.guilds.cache.forEach((guild) => {
      console.log(`Guild: ${guild.name}`);
      guild.channels.cache.forEach((channel) => {
        console.log(
          `- Channel [${channel.type}]: ${channel.name} (${channel.id})`
        );
      });
    });
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is additional information about the code",
      title = "Code example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    this.sendMessage(codeMessage);
  }

  sendMessage(message) {
    const channel = this.client.channels.cache.get(this.channelId);
    if (channel) {
      channel.send(message);
    } else {
      console.error(`Channel with ID ${this.channelId} not found`);
    }
  }
}

module.exports = DiscordBot;

"use strict";

const DiscordBot = require("../logger/discord.log");
const discordBotInstance = new DiscordBot();

const pushToLogDiscord = async (req, res, next) => {
  try {
    discordBotInstance.sendToFormatCode({
      title: `Method ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")}${req.originalUrl}`,
    });
    return next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  pushToLogDiscord,
};

"use strict";
const { createClient } = require("redis");
const { promisify } = require("util");

// Log the Redis URL to verify it
console.log("Redis URL: ", process.env.URL_REDIS);

const client = createClient({
  url: process.env.URL_REDIS,
  legacyMode: true, // Required if you are using a library that expects Redis v3 commands
});

client.on("error", (err) => {
  console.error("Redis error: ", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});


client.connect().catch(console.error);

module.exports = client;

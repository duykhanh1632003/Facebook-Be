const { createClient } = require("redis");

const client = createClient({
  url: process.env.URL_REDIS,
  legacyMode: true,
});

client.on("error", (err) => {
  console.error("Redis error: ", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.connect().catch(console.error);

module.exports = client;

"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  async connect(type = "mongodb", retryCount = 3) {
    try {
      if (type === "mongodb") {
        mongoose.set("debug", true);
        mongoose.set("debug", { color: true });
      }

      await mongoose.connect(process.env.MONGOOSE_HTTP, { maxPoolSize: 100 });
      console.log("Connected to MongoDB successfully");
      countConnect();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);

      if (retryCount > 0) {
        console.log(`Retrying connection... Attempts left: ${retryCount}`);
        await this.wait(5000); // Wait for 5 seconds before retrying
        await this.connect(type, retryCount - 1);
      } else {
        console.error("Maximum retry attempts reached. Unable to connect.");
      }
    }
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;

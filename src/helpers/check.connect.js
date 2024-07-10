"use strict";

const mongoose = require("mongoose");
const _SECONDS = 15000;
const os = require("os");
const process = require("process");

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("Number of connection", numConnection);
};

//check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;
    console.log(`Active connections ${numConnection}`);
    console.log(`Memory usage ${memoryUsage / 1024 / 1024} mb`);
    if (numConnection > maxConnections) {
      console.log("Update server");
    }
  }, _SECONDS);
};
module.exports = {
  countConnect,
  checkOverload,
};

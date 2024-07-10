"use strict";

const multer = require("multer");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  destination: function (req, file, cb) {
    cb(null, "../uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now}-${file.filename}`);
  },
});

module.exports = {
  uploadMemory,
  uploadDisk,
};

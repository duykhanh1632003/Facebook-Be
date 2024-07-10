"use strict";

const client = require("../db/init.redis");

class RedisService {
  static handlePostBook = async ({ title, name, author }) => {
    if (!title || !name || !author) {
      return res
        .status(400)
        .json({ message: "Title, name, and author are required" });
    }

    const book = { title, name, author };
    const key = `book:${name}`;

    try {
      await client.lPush("kakakaa", 3600, 2); // Lưu vào cache với thời gian hết hạn là 1 giờ
      res.status(201).json({ message: "Book saved successfully", book });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  
}

module.exports = RedisService;

const redis = require("redis");
const client = require("../db/init.redis");

class RedisService {
  static async handlePostBook(bookData) {
    // Lưu dữ liệu sách vào Redis
    return new Promise((resolve, reject) => {
      client.set(bookData.name, JSON.stringify(bookData), (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  static async handleGetBook(name) {
    // Lấy dữ liệu sách từ Redis
    return new Promise((resolve, reject) => {
      client.get(name, (err, reply) => {
        if (err) reject(err);
        resolve(JSON.parse(reply));
      });
    });
  }
} 

module.exports = RedisService;

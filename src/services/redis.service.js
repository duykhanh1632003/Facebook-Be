const client = require("../db/init.redis");

class RedisService {
  static async acquireLock(lockName, timeout = 5000) {
    const lockKey = `lock:${lockName}`;
    const end = Date.now() + timeout;

    while (Date.now() < end) {
      const result = await new Promise((resolve, reject) => {
        client.set(lockKey, "locked", "NX", "PX", timeout, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      });

      if (result === "OK") {
        return true;
      }

      // Wait for a short time before retrying
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return false;
  }

  static async releaseLock(lockName) {
    const lockKey = `lock:${lockName}`;
    return new Promise((resolve, reject) => {
      client.del(lockKey, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  static async handlePostBook(bookData) {
    const lockName = `book:${bookData.name}`;

    if (await this.acquireLock(lockName)) {
      try {
        // Lưu dữ liệu sách vào Redis
        return new Promise((resolve, reject) => {
          client.set(bookData.name, JSON.stringify(bookData), (err, reply) => {
            if (err) reject(err);
            resolve(reply);
          });
        });
      } finally {
        await this.releaseLock(lockName);
      }
    } else {
      throw new Error("Could not acquire lock");
    }
  }

  static async handleGetBook(name) {
    const lockName = `book:${name}`;

    if (await this.acquireLock(lockName)) {
      try {
        // Lấy dữ liệu sách từ Redis
        return new Promise((resolve, reject) => {
          client.get(name, (err, reply) => {
            if (err) reject(err);
            resolve(JSON.parse(reply));
          });
        });
      } finally {
        await this.releaseLock(lockName);
      }
    } else {
      throw new Error("Could not acquire lock");
    }
  }
}

module.exports = RedisService;

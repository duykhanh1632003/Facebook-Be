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
    const key = `book:${bookData.name}`;
  
    // Save book data to Redis
    await new Promise((resolve, reject) => {
      client.set(key, JSON.stringify(bookData), (err, reply) => {
        if (err) return reject(err);
        console.log(reply);
        resolve(reply);
      });
    });
  
    // Retrieve the saved book data from Redis
    const data = await new Promise((resolve, reject) => {
      client.get(key, (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  
    return JSON.parse(data); // Parse the data to convert it back to an object
  }
  

  static async handlePostSearch({ userId, searchParams }) {
    const key = `search:${userId}`;
    console.log("data key", key);
  
    // Save searchParams to Redis
    await new Promise((resolve, reject) => {
      client.set(key, JSON.stringify(searchParams), (err, reply) => {
        if (err) return reject(err);
        console.log(reply);
        resolve(reply);
      });
    });
  }
  

  static async handleGetSearch(userId) {
    const key = `search:${userId}`;
    const data = await new Promise((resolve, reject) => {
      client.get(key, (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  
    // Handle case where data is null
    if (!data) {
      return null;
    }
  
    return JSON.parse(data);
  }
  

}

module.exports = RedisService;

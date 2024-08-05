const client = require("../db/init.redis");

const checkCache = (req, res, next) => {
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

module.exports = checkCache;

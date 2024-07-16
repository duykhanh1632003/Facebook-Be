const { Client } = require("@elastic/elasticsearch");

const clientEs = new Client({ node: "http://localhost:9200" });

clientEs.ping({}, { requestTimeout: 3000 }, (error) => {
  if (error) {
    console.trace("Elasticsearch cluster is down!");
  } else {
    console.log("Elasticsearch is connected");
  }
});
module.exports = clientEs;

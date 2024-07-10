const amqp = require("amqplib");

const message = "hello rabbit MQ";
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("send message", message);
  } catch (e) {
    console.log(e);
  }
};

runProducer().catch(console.error);

const amqp = require("amqplib");

const runComsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.consume(
      queueName,
      (message) => {
        console.log(`message sended`, message.content.toString());
      },
      {
        noAck: true,
      }
    );
    console.log("send message", message);
  } catch (e) {
    console.log(e);
  }
};

runComsumer().catch(console.error);

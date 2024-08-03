const amqp = require("amqplib");

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const notificationExchange = "notificationEx";
    const notiQueue = "notificationQueueProcess";
    const notificationExchangeDLX = "notificationExDLX";
    const notifiRoutingKeyDLX = "notifiRoutingKeyDLX";
    //create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });
    //create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phep cac ket noi truy cap cung 1 luc hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notifiRoutingKeyDLX,
    });
    //3 bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    //4 send message:
    const msg = "send a notification...";
      await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
        expiration: '10000'
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (e) {
    console.log(e);
  }
};

runProducer().catch(console.error);

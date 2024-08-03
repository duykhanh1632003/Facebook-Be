"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../db/init.rabbit");

const messageService = {
  conSumerToQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (e) {
      console.log(e)

    }
  },

  conSumerToQueueNormal: async () => {
    try {
      const { channel } = await connectToRabbitMQ();

      setTimeout(() => {
        channel.consume("Send notificationsQueue success", (msg) => {
          console.log("Data msg", msg.content.toString());
        });
      }, 10000);
    } catch (e) {
      console.log(e);
    }
  },

  consumerToQueueFailed: async () => {
    try {
      const { channel } = connectToRabbitMQ();
      const notificationExchangeDLX = "notificationExDLX";
      const notifiRoutingKeyDLX = "notificationRoutingKeyDLX";
      const notiQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: true,
      });
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notifiRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            "this is fail notification",
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = messageService;

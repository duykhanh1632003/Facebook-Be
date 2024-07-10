"use strict";

const amqp = require("amqplib");
const { BadRequestError } = require("../core/error.response");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) {
      throw BadRequestError("Connection to rabbitMQ is not established");
    }
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log("wait........");
    channel.consume(
      queueName,
      (msg) => {
        console.log("Received message", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (e) {
    console.log(e);
  }
};
module.exports = { connectToRabbitMQ, consumerQueue };

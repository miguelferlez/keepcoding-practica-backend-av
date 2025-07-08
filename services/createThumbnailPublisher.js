import "dotenv/config";
import amqp from "amqplib";
import process from "node:process";
import { EXCHANGE_NAME } from "../lib/utils.js";

async function publishThumbnail(imagePath) {
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  channel.publish(EXCHANGE_NAME, "*", Buffer.from(imagePath), {
    persistent: true,
  });

  console.log(`image ${imagePath} successfully sent`);

  setTimeout(() => connection.close(), 500);
}

export default publishThumbnail;

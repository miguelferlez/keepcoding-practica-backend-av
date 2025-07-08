import "dotenv/config";
import path from "node:path";
import { Jimp } from "jimp";
import amqp from "amqplib";
import process from "node:process";
import { QUEUE_NAME, EXCHANGE_NAME } from "../lib/utils.js";

const connection = await amqp.connect(process.env.RABBITMQ_URI);
const channel = await connection.createChannel();

await channel.assertQueue(QUEUE_NAME, { durable: true });
await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "*");
channel.consume(QUEUE_NAME, async (message) => {
  try {
    if (message) {
      const imagePath = message.content.toString();
      const extension = path.extname(imagePath);
      const imageName = path.basename(imagePath, extension);
      const thumbnailPath = `${process.env.PRODUCT_IMAGE_DIR}/${imageName}_thumbnail${extension}`;

      const image = await Jimp.read(imagePath);
      image.cover({ w: 100, h: 100 });
      await image.write(thumbnailPath);

      console.log(`thumbnail ${thumbnailPath} successfully generated`);

      channel.ack(message);
    }
  } catch (error) {
    console.error("error sending thumbnail:", error);
  }
});

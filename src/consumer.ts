import ampq from "amqplib";
import { CertifyDocumentUseCase } from "./use-cases/CertifyDocumentUseCase";
import CertifyDocumentModel from "./models/CertifyDocumentModel";
import 'dotenv/config';

async function consumer() {
  const conn = await ampq.connect({
    hostname: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT),
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASS,
  });

  const channel = await conn.createChannel();

  await channel.prefetch(5);

  channel.consume('certify-document', async (data) => {
    const msg = JSON.parse(data.content.toString());

    try {
      const documentDetails = await CertifyDocumentModel.getDetailsById(msg.id);
      await CertifyDocumentUseCase(Buffer.from(documentDetails.file, "base64"));
      await CertifyDocumentModel.setProcessed(msg.id);
    } catch (err: any) {
      await CertifyDocumentModel.setErrored(msg.id, err.message);
    }

    channel.ack(data);
  }
  );
}

consumer()
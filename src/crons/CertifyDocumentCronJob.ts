import { CronJob } from "cron";
import ampq from "amqplib";
import CertifyDocumentModel from "../models/CertifyDocumentModel";
import 'dotenv/config';

class CertifyDocumentCronJob {
  private isCronRunning: boolean = false;
  public async start() {
    const conn = await ampq.connect({
      hostname: process.env.RABBITMQ_HOST,
      port: Number(process.env.RABBITMQ_PORT),
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASS,
    });

    const channel = await conn.createChannel();

    await channel.assertQueue("certify-document", {
      durable: true
    });

    new CronJob(
      "*/5 * * * * *",
      async () => {
        if (this.isCronRunning) {
          return;
        }

        this.isCronRunning = true;

        const certifyPendings = await CertifyDocumentModel.getPendings(10);
        for (const certify of certifyPendings) {
          const dataForRabbit = {
            id: certify.id
          }

          const send = channel.publish('', 'certify-document', Buffer.from(JSON.stringify(dataForRabbit)));

          if (send){
            await CertifyDocumentModel.setSendToQueue(certify.id);
          }

        }

        this.isCronRunning = false;
      },
      null,
      true,
      "America/Sao_Paulo"
    );
  }
}

export default new CertifyDocumentCronJob();

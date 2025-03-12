import amqp from 'amqplib'

async function main(){
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
  })

  const channel = await conn.createChannel()

  await channel.assertExchange('my_fanout_exchange', 'fanout', {
    durable: true
  })

  await channel.assertQueue('email_notification', {
    durable: true
  })

  await channel.assertQueue('sms_notification', {
    durable: true
  })

  await channel.assertQueue('push_notification', {
    durable: true
  })

  await channel.bindQueue('email_notification', 'my_fanout_exchange', '')
  await channel.bindQueue('sms_notification', 'my_fanout_exchange', '')
  await channel.bindQueue('push_notification', 'my_fanout_exchange', '')

  channel.publish('my_fanout_exchange', '', Buffer.from(`my_message`))

  await channel.close()
  await conn.close()
}

main()
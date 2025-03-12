import amqp from 'amqplib'

async function main(){
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
  })

  const channel = await conn.createChannel()

  await channel.assertExchange('my_header_exchange', 'headers', {
    durable: true
  })

  await channel.assertQueue('email_notification')
  await channel.assertQueue('sms_notification')
  await channel.assertQueue('push_notification')

  await channel.bindQueue('email_notification', 'my_header_exchange', '', {
    'x-match': 'all',
    'type': 'email'
  })

  await channel.bindQueue('sms_notification', 'my_header_exchange', '', {
    'x-match': 'all',
    'type': 'sms'
  })

  await channel.bindQueue('push_notification', 'my_header_exchange', '', {
    'x-match': 'all',
    'type': 'push'
  })

  await channel.assertExchange('my_fanout_notification_exchange', 'fanout', {
    durable: true
  })

  await channel.bindQueue('email_notification', 'my_fanout_notification_exchange', '')
  await channel.bindQueue('sms_notification', 'my_fanout_notification_exchange', '')
  await channel.bindQueue('push_notification', 'my_fanout_notification_exchange', '')

  await channel.bindExchange('my_fanout_notification_exchange', 'my_header_exchange', '', {
    'x-match': 'all',
    'type': 'all'
  })

  channel.publish('my_header_exchange', '', Buffer.from(`my_message`), {
    headers: {
      'type': 'email'
    }
  })

  await channel.close()
  await conn.close()
}

main()
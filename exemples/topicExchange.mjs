import amqp from 'amqplib'

async function main(){
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password'
  })

  const channel = await conn.createChannel()

  await channel.assertExchange('my_topic_exchange', 'topic', {
    durable: true
  })

  await channel.assertQueue('system_logs', {
    durable: true
  })

  await channel.assertQueue('system_errors', {
    durable: true
  })

  await channel.bindQueue('system_logs', 'my_topic_exchange', 'logs.#')
  await channel.bindQueue('system_errors', 'my_topic_exchange', '*.error')


  channel.publish('my_topic_exchange', 'logs.system.info', Buffer.from(`my_info_message`))
  channel.publish('my_topic_exchange', 'logs.system.error', Buffer.from(`my_error_message`))


  await channel.close()
  await conn.close()
}

main()
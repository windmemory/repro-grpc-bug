import { TestServer } from './server'
import { Client } from './client'

const main = async () => {

  const server = new TestServer()
  await server.start()

  const client = new Client()
  client.start()
}

main()

import grpc from 'grpc'
import { FileBox } from 'file-box'
import { Transform } from 'stream'

import { ENDPOINT, GRPC_OPTIONS } from '../src/config'

import {
  IMyServiceServer,
  MyServiceService,
}                   from '../generated/proto-ts/my-proto_grpc_pb'
import {
  EventRequest,
  EventResponse,
  FileBoxChunk,
  MessageFileResponse,
  MessageSendFileStreamRequest,
}                   from '../generated/proto-ts/my-proto_pb'

// const blocked = require('blocked')
// blocked(function(ms){
//   console.info("=============BLOCKED FOR " + ms + " ms")
// }, {
//   threshold: 150,
// })
const impl: IMyServiceServer =  {
  messageFile: async (call, callback) => {
    const id = call.request.getId()
    console.log(`receive request with id: ${id}`)

    const response = new MessageFileResponse()
    response.setFilebox('test')

    callback(null, response)
  },
  messageFileStream: async (call) => {
    const id = call.request.getId()
    console.log(`receive request with id: ${id}`)

    const fileBox = FileBox.fromFile(`${__dirname}/test.json`)

    const chunk = new FileBoxChunk()
    chunk.setName(fileBox.name)
    call.write(chunk)

    const toFileBoxChunk = new Transform({
      transform: (chunk, encoding, callback) => {
        void encoding
        const fileBoxChunk = new FileBoxChunk()
        fileBoxChunk.setData(chunk)
        callback(null, fileBoxChunk)
      }
    })

    const stream = await fileBox.toStream()
    stream.pipe(toFileBoxChunk).pipe(call)
  },

  messageSendFileStream: async (callStream) => {
    const conversationId = await new Promise((resolve, reject) => {
      const timer = setTimeout(reject, 1000 * 10)
      callStream.once('data', (chunk: MessageSendFileStreamRequest) => {
        if (!chunk.hasConversationId()) {
          reject('no conversation id')
        }

        const conversationId = chunk.getConversationId()
        resolve(conversationId)

        clearTimeout(timer)
      })
    })
  },

  event: async (call) => {
    setInterval(() => {
      const response = new EventResponse()
      response.setPayload('heartbeat: ' + Date.now())
      // console.info(`send heartbeat`)
      call.write(response)
    }, 1000)
  }
}

async function main () {
  const server = new grpc.Server({
    ...GRPC_OPTIONS,
  })

  this.server.addService(
    MyServiceService,
    impl,
  )
  const port = server.bind(
    ENDPOINT,
    grpc.ServerCredentials.createInsecure(),
  )
  console.info('port: ', port)
  server.start()
}

main()
  .catch(console.error)

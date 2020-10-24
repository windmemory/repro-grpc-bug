import grpc from 'grpc'
import { FileBox } from 'file-box'

import { ENDPOINT, GRPC_OPTIONS } from '../src/config'

import {
  IMyServiceServer,
  MyServiceService,
}                   from '../generated/proto-ts/my-proto_grpc_pb'
import {
  EventResponse,
  MessageFileResponse,
}                   from '../generated/proto-ts/my-proto_pb'
import { toMessageSendFileStreamRequestArgs } from '../src/grpc-stream-parser/message-send-file-stream-request'
import { toFileBoxChunk } from '../src/grpc-stream-parser/to-file-box'

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

    const fileBox = FileBox.fromFile(`${__dirname}/../tests/fixtures/test.dat`)

    const stream = await toFileBoxChunk(fileBox)
    stream.pipe(call)
  },

  messageSendFileStream: async (callStream) => {
    const args = await toMessageSendFileStreamRequestArgs(callStream)
    console.info('conversation id:', args.conversationId)
    args.fileBox.toFile(undefined, true)
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

  server.addService(
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

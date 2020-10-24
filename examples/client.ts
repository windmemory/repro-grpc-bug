import grpc from 'grpc'

import { ENDPOINT, GRPC_OPTIONS } from '../src/config'

import { MyServiceClient } from '../generated/proto-ts/my-proto_grpc_pb'

// import {
//   MessageFileStreamRequest, MessageSendFileStreamRequest,
// }                 from '../generated/proto-ts/my-proto_pb'
// import { toFileBox } from '../src/grpc-stream-parser/to-file-box'

import { toMessageSendFileStreamRequest } from '../src/grpc-stream-parser/message-send-file-stream-request'
import FileBox from 'file-box'

async function main () {
  const grpcClient = new MyServiceClient(
    ENDPOINT,
    grpc.credentials.createInsecure(),
    GRPC_OPTIONS,
  )

  // const request = new MessageFileStreamRequest()
  // request.setId('id')

  // const stream = grpcClient.messageFileStream(request)
  // const fileBox = await toFileBox(stream)
  // await fileBox.toFile()

  const fileBox = FileBox.fromFile(`${__dirname}/../tests/fixtures/test.dat`)

  const stream = await toMessageSendFileStreamRequest(
    'conversation_id',
    fileBox,
  )

  const call = grpcClient.messageSendFileStream((error) => {
    if (error) {
      console.error(error)
    } else {
      console.info('done')
    }
  })

  void stream

  // call.end()

  stream.pipe(call)
  stream.on('end', () => {
    console.info('end event')
    call.end()
  })

  console.info('end')

}

main()
  .catch(console.error)

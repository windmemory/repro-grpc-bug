import grpc from 'grpc'

import { ENDPOINT, GRPC_OPTIONS } from '../src/config'

import { MyServiceClient } from '../generated/proto-ts/my-proto_grpc_pb'
import {
  EventRequest,
  EventResponse,
}                 from '../generated/proto-ts/my-proto_pb'

async function main () {
  const grpcClient = new MyServiceClient(
    ENDPOINT,
    grpc.credentials.createInsecure(),
    GRPC_OPTIONS,
  )

  const request = new EventRequest()
  const stream = grpcClient.event(request)
  stream.once('data', () => {
  })
  stream.on('data', (data: EventResponse) => {
    console.info(`${data.getPayload()}`)
  })
}

main()
  .catch(console.error)

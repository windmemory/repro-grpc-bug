import * as grpc from 'grpc'
import * as moment from 'moment'

import { MyServiceClient } from '../generated/proto-ts/my-proto_grpc_pb'
import { EventRequest, EventResponse, MessageFileRequest } from '../generated/proto-ts/my-proto_pb'
import { ENDPOINT, GRPC_OPTIONS, TOTAL_REQUEST } from './config'

const PRE = 'CLIENT'

export class Client {
  private grpcClient: MyServiceClient
  private responseCount: number = 0

  public start () {
    this.grpcClient = new MyServiceClient(
      ENDPOINT,
      grpc.credentials.createInsecure(),
      { ...GRPC_OPTIONS }
    )
    this.triggerHeartbeat()
  }

  public async makeCall (i: number) {
    const request = new MessageFileRequest()
    request.setId(i.toString())
    this.grpcClient.messageFile(request, (error, response) => {
      if (error) {
        console.error(error)
      } else {
        const data = response.getFilebox()
        console.log(`${this.getPrefix()}: id: ${i} receive response with length: ${data.length}`)
        if (++this.responseCount === TOTAL_REQUEST) {
          setTimeout(() => {
            process.exit(0)
          }, 5000)
        }
      }
    })
  }

  public triggerHeartbeat () {
    const request = new EventRequest()
    const stream = this.grpcClient.event(request)
    stream.once('data', () => {
      setTimeout(() => {
        for (let i = 0; i < TOTAL_REQUEST; i++) {
          this.makeCall(i)
        }
      }, 500)
    })
    stream.on('data', (data: EventResponse) => {
      console.info(`${this.getPrefix()}: ${data.getPayload()}`)
    })
  }

  private getPrefix () {
    return `${PRE} ${moment().format('mm:ss.SSS')}`
  }
}

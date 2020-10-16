import FileBox from 'file-box'
import * as grpc from 'grpc'
import * as moment from 'moment'
import {
  PassThrough,
} from 'stream'

import { MyServiceClient } from '../generated/proto-ts/my-proto_grpc_pb'
import { EventRequest, EventResponse, MessageFileRequest, MessageFileStreamRequest, MessageFileStreamResponse } from '../generated/proto-ts/my-proto_pb'
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
    console.log(`${this.getPrefix()}: makeCall(${i})`)

    const request = new MessageFileRequest()
    request.setId(i.toString())
    this.grpcClient.messageFile(request, (error, response) => {
      console.log(`${this.getPrefix()}: id: ${i} received response`)
      if (error) {
        console.error(error)
      } else {
        const data = response.getFilebox()
        console.log(`${this.getPrefix()}: id: ${i} received response with length: ${data.length}`)
        if (++this.responseCount === TOTAL_REQUEST) {
          setTimeout(() => {
            process.exit(0)
          }, 5000)
        }
      }
    })

    console.log(`${this.getPrefix()}: makeCall(${i}) return`)
  }

  public async makeCallStream (i: number) {
    console.log(`${this.getPrefix()}: makeCall(${i})`)

    const request = new MessageFileStreamRequest()
    request.setId(i.toString())

    const stream = this.grpcClient.messageFileStream(request)

    const outputStream = new PassThrough()
    let fileName: string | undefined
    stream.on('data', (response: MessageFileStreamResponse) => {
      if (!fileName) {
        fileName = response.getName()
      }
      outputStream.write(response.getData())
    }).on('end', () => outputStream.end())

    if (!fileName) {
      // FIXME: How to get the fileName from the server?
      console.error('Can not create file box since no fileName')
      process.exit(-1)
    }

    const fileBox = FileBox.fromStream(outputStream, fileName)
    await fileBox.toFile(undefined, true)
    console.log(`${this.getPrefix()}: id: ${i} file received`)
    if (++this.responseCount === TOTAL_REQUEST) {
      setTimeout(() => {
        process.exit(0)
      }, 1000)
    }
  }

  public triggerHeartbeat () {
    const request = new EventRequest()
    const stream = this.grpcClient.event(request)
    stream.once('data', () => {
      setTimeout(() => {
        for (let i = 0; i < TOTAL_REQUEST; i++) {
          this.makeCallStream(i)
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

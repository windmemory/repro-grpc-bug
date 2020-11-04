import * as grpc from 'grpc'
import moment from 'moment'

import { MyServiceClient } from '../generated/proto-ts/my-proto_grpc_pb'
import { EventRequest, EventResponse, MessageFileRequest, MessageFileStreamRequest } from '../generated/proto-ts/my-proto_pb'
import { ENDPOINT, GRPC_OPTIONS, TOTAL_REQUEST } from './config'
import { chunkStreamToFileBox } from './stream-new-version/file-box-helper'
import { unpackFileBoxChunk } from './stream-new-version/file-box-packer'

const PRE = 'CLIENT'

export class Client {
  private grpcClient?: MyServiceClient
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
    this.grpcClient!.messageFile(request, (error, response) => {
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


    const stream = this.grpcClient!.messageFileStream(request)
    stream.on('error', e => {
      // FIXME: Can not catch the error below
      throw e
    })

    const chunkStream = unpackFileBoxChunk(stream)

    const fileBox = await chunkStreamToFileBox(chunkStream)
    return fileBox
  }

  public triggerHeartbeat () {
    const request = new EventRequest()
    const stream = this.grpcClient!.event(request)
    stream.once('data', () => {
      setTimeout(async () => {
        for (let i = 0; i < TOTAL_REQUEST; i++) {
          let result
          try {
            result = await this.makeCallStream(i)
          } catch (e) {
            console.log('code won\'t get here.')
            console.error(e)
            return
          }
          console.info(`${this.getPrefix()}: received data`)
          try {
            await result.toFile(undefined, true)
          } catch (e) {
            console.error(e)
          }
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

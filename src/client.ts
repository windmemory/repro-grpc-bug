import FileBox from 'file-box'
import * as grpc from 'grpc'
import * as moment from 'moment'
import {
  PassThrough,
  Transform,
} from 'stream'

import { MyServiceClient } from '../generated/proto-ts/my-proto_grpc_pb'
import { EventRequest, EventResponse, MessageFileRequest, MessageFileStreamRequest } from '../generated/proto-ts/my-proto_pb'
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

    const metaData = new grpc.Metadata()
    metaData.add('name', 'fileName')
    const stream = this.grpcClient.messageFileStream(request, metaData)

    const meta = await new Promise<MessageFileStreamResponseMeta>((resolve, reject) => {
      stream.once('data', (response: MessageFileStreamResponse) => {
        if (response.hasMeta()) {
          const meta = response.getMeta()
          resolve(meta)
        } else {
          reject('no meta for file box stream')
        }
      })
    })

    const trans = new Transform({
      transform (chunk: MessageFileStreamResponse, encoding, cb) {
        console.info('Transform ...')
        if (chunk.hasData()) {
          const data = chunk.getData()
          console.info('chunk data:', typeof data, data instanceof Uint8Array)
          console.info('chunk data:', data)
          cb(null, data)
        } else {
          cb(new Error('no data for file box stream'))
        }
      },
      objectMode: true,
    })

    console.info('filebox 1')
    return FileBox.fromStream(
      stream.pipe(trans),
      meta.getName(),
    )

    // const fileName = await new Promise<string>((resolve, reject) => {
    //   stream.once('metadata', (metadata: grpc.Metadata) => {
    //     resolve(metadata.get('name')[0].toString())
    //   }).once('error', err => reject(err))
    // })


    // stream.on('data', (response: MessageFileStreamResponse) => {
    //   outputStream.write(response.getData())
    // }).on('end', () => {
    //   outputStream.end()
    // })

    // const fileBox = FileBox.fromStream(outputStream, fileName)
    // await fileBox.toFile(undefined, true)
    // console.log(`${this.getPrefix()}: id: ${i} file received`)
    // if (++this.responseCount === TOTAL_REQUEST) {
    //   setTimeout(() => {
    //     process.exit(0)
    //   }, 1000)
    // }
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

import * as grpc from 'grpc'
import moment from 'moment'
import { FileBox } from 'file-box'
import * as fs from 'fs'

import { IMyServiceServer, MyServiceService } from '../generated/proto-ts/my-proto_grpc_pb'
import { EventResponse, MessageFileResponse, MessageFileStreamResponse } from '../generated/proto-ts/my-proto_pb'
import { FILE_PATH, GRPC_OPTIONS, ENDPOINT, TOTAL_REQUEST } from './config'
import { fileBoxToChunkStream } from './stream-new-version/file-box-helper'
import { packFileBoxChunk } from './stream-new-version/file-box-packer'

const PRE = 'SERVER'

export class TestServer {
  private server?: grpc.Server

  private healthInterval?: NodeJS.Timeout

  private requestCount: number = 0
  private data = this.getData()

  public async start () {
    this.server = new grpc.Server({
      ...GRPC_OPTIONS,
    })
    const impl: IMyServiceServer =  {
      messageFile: async (call, callback) => {
        const id = call.request.getId()
        console.log(`${this.getPrefix()}: receive request with id: ${id}`)

        const response = new MessageFileResponse()
        response.setFilebox(this.data)

        console.info(`${this.getPrefix()}: message file sending... id: ${id}`)
        callback(null, response)
        console.info(`${this.getPrefix()}: message file sent... id: ${id}`)

        if (++this.requestCount === TOTAL_REQUEST) {
          console.info(`${this.getPrefix()}: message file done`)
          setTimeout(() => {
            clearInterval(this.healthInterval!)
            console.info('cleared interval')
          }, 5 * 1000)
        }

      },
      messageFileStream: async (call) => {
        const id = call.request.getId()
        console.log(`${this.getPrefix()}: receive request with id: ${id}`)

        const fileBox = FileBox.fromFile(`${__dirname}/test.json`)
        fileBox.name = `${Date.now()}-${fileBox.name}`

        const chunkStream = await fileBoxToChunkStream(fileBox)
        const responseStream = packFileBoxChunk(chunkStream, MessageFileStreamResponse)
        call.emit('error', new Error('lalala'))
        responseStream.pipe(call)
      },

      messageSendFileStream: async (call, callback) => {
        console.log(call, callback)
      },

      event: async (call) => {
        this.healthInterval = setInterval(() => {
          const response = new EventResponse()
          response.setPayload('heartbeat: ' + Date.now())
          console.info(`${this.getPrefix()}: send heartbeat`)
          call.write(response)
        }, 100)
      }
    }

    this.server.addService(
      MyServiceService,
      impl as any,
    )
    this.server.bindAsync(
      ENDPOINT,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        console.info(error)
        console.log(`Server bind port: ${port}`)

        this.server!.start()

      },
    )
  }

  private getData () {
    const data = fs.readFileSync(FILE_PATH, { encoding: 'utf-8' })
    const parsedData = JSON.parse(data)
    return parsedData.data
  }

  private getPrefix () {
    return `${PRE} ${moment().format('mm:ss.SSS')}`
  }
}

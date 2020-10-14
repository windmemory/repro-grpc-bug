import * as grpc from 'grpc'
import * as moment from 'moment'
import * as fs from 'fs'

import { IMyServiceServer, MyServiceService } from '../generated/proto-ts/my-proto_grpc_pb'
import { EventResponse, MessageFileResponse } from '../generated/proto-ts/my-proto_pb'
import { FILE_PATH, GRPC_OPTIONS, ENDPOINT, TOTAL_REQUEST } from './config'

const PRE = 'SERVER'

export class TestServer {
  private server: grpc.Server

  private healthInterval: NodeJS.Timeout

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
        console.info(`${this.getPrefix()}: message file sending response...`)
        callback(null, response)
        console.info(`${this.getPrefix()}: message file response sent`)
        if (++this.requestCount === TOTAL_REQUEST) {
          clearInterval(this.healthInterval)
        }
      },
      event: async (call) => {
        this.healthInterval = setInterval(() => {
          const response = new EventResponse()
          response.setPayload('heartbeat')
          console.info(`${this.getPrefix()}: send heartbeat`)
          call.write(response)
        }, 100)
      }
    }

    this.server.addService(
      MyServiceService,
      impl,
    )
    const port = this.server.bind(
      ENDPOINT,
      grpc.ServerCredentials.createInsecure()
    )

    console.log(`Server bind port: ${port}`)

    this.server.start()
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

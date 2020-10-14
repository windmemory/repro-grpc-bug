import * as fs from 'fs'

import { TestServer } from './server'
import { Client } from './client'
import { DEFAULT_FILE_SIZE, FILE_PATH } from './config'
import { generateData } from './data-generator'

const checkDataFile = () => {
  const dataFileExist = fs.existsSync(FILE_PATH)
  if (!dataFileExist) {
    console.log(`Data File not found, generating data file with default size: ${DEFAULT_FILE_SIZE}`)
    generateData(DEFAULT_FILE_SIZE)
  }
}

const main = async () => {

  checkDataFile()

  const server = new TestServer()
  await server.start()

  const client = new Client()
  client.start()
}

main()

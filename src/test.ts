import * as fs from 'fs'

import { TestServer } from './server'
import { Client } from './client'
import { DEFAULT_FILE_SIZE, FILE_PATH } from './config'
import { generateData } from './data-generator'

const blocked = require('blocked')

const checkDataFile = () => {
  const dataFileExist = fs.existsSync(FILE_PATH)
  if (!dataFileExist) {
    console.log(`Data File not found, generating data file with default size: ${DEFAULT_FILE_SIZE}`)
    generateData(DEFAULT_FILE_SIZE)
  }
}

const main = async () => {

  blocked(function(ms: number){
    console.info("=============BLOCKED FOR " + ms + " ms")
  }, {
    threshold: 150,
  })

  checkDataFile()

  const server = new TestServer()
  await server.start()

  const client = new Client()
  client.start()
}

main()

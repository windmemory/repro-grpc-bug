import * as fs from 'fs'

import { FILE_PATH } from './config'

const parseSize = (rawSize: string) => {
  if (/^\d+[mM]$/.test(rawSize)) {
    const numStr = rawSize.replace(/[mM]/, '')
    const number = Number(numStr)
    return number * 1000 * 1000
  } else if (/^\d+[kK]$/.test(rawSize)) {
    const numStr = rawSize.replace(/[kK]/, '')
    const number = Number(numStr)
    return number * 1000
  } else {
    return Number(rawSize)
  }
}

const getLongString = (length: number) => {
  const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  let str = ''
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)]
  }
  return str
}

const main = async () => {
  const size = process.argv[2]
  const parsedSize = parseSize(size)
  const str = getLongString(parsedSize)
  fs.writeFileSync(FILE_PATH, JSON.stringify({ data: str }))
  console.info(`Successfully write ${size} data into test.json`)
}

main()

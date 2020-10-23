import { FileBox } from 'file-box'
import {
  PassThrough,
}                   from 'stream'

import {
  Readable,
  TypedTransform,
}                   from './typed-stream'

import {
  FileBoxChunk,
}                 from '../../generated/proto-ts/my-proto_pb'
import {
  firstData,
}           from './first-data'

async function toFileBox (
  stream: Readable<FileBoxChunk>,
): Promise<FileBox> {
  const decode = new TypedTransform<FileBoxChunk, any> ({
    transform: (chunk: FileBoxChunk, _, callback) => {
      if (!chunk.hasData()) {
        throw new Error('no data')
      }
      const data = chunk.getData()
      callback(null, data)
    },
    objectMode: true,
  })

  const chunk = await firstData(stream)
  if (!chunk.hasName()) {
    throw new Error('no name')
  }
  const fileName = chunk.getName()
  const fileStream = stream.pipe(decode)

  const fileBox = FileBox.fromStream(fileStream, fileName)

  return fileBox
}

async function toFileBoxChunk (
  fileBox: FileBox,
): Promise<Readable<FileBoxChunk>> {
  const encode = new TypedTransform<any, FileBoxChunk> ({
    transform: (chunk: any, _, callback) => {
      const fileBoxChunk = new FileBoxChunk()
      fileBoxChunk.setData(chunk)
      callback(null, fileBoxChunk)
    },
    objectMode: true,
  })

  const stream = new PassThrough({ objectMode: true })

  const chunk = new FileBoxChunk()
  chunk.setName(fileBox.name)

  // FIXME: Huan(202010) write might return false
  stream.write(chunk)

  fileBox
    .pipe(encode)
    .pipe(stream)

  return stream
}

export {
  toFileBox,
  toFileBoxChunk,
}

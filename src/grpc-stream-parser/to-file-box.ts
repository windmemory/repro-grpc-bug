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

const decoder = () => new TypedTransform<FileBoxChunk, any> ({
  transform: (chunk: FileBoxChunk, _: any, callback: any) => {
    if (!chunk.hasData()) {
      throw new Error('no data')
    }
    const data = chunk.getData()
    callback(null, data)
  },
  objectMode: true,
})

async function toFileBox (
  stream: Readable<FileBoxChunk>,
): Promise<FileBox> {
  const chunk = await firstData(stream)
  if (!chunk.hasName()) {
    throw new Error('no name')
  }
  const fileName = chunk.getName()
  const fileStream = stream.pipe(decoder())

  const fileBox = FileBox.fromStream(fileStream, fileName)

  return fileBox
}

const encoder = () => new TypedTransform<any, FileBoxChunk> ({
  transform: (chunk: any, _: any, callback: any) => {
    const fileBoxChunk = new FileBoxChunk()
    fileBoxChunk.setData(chunk)
    callback(null, fileBoxChunk)
  },
  objectMode: true,
})

async function toFileBoxChunk (
  fileBox: FileBox,
): Promise<Readable<FileBoxChunk>> {
  const stream = new PassThrough({ objectMode: true })

  const chunk = new FileBoxChunk()
  chunk.setName(fileBox.name)

  // FIXME: Huan(202010) write might return false
  stream.write(chunk)

  fileBox
    .pipe(encoder())
    .pipe(stream)

  return stream
}

export {
  toFileBox,
  toFileBoxChunk,
}

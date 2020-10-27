import {
  FileBoxChunk,
}                 from '../../generated/proto-ts/my-proto_pb'

import {
  Readable,
  TypedTransform,
}                   from './typed-stream'

const encoder = <T extends { setFileBoxChunk: (chunk: FileBoxChunk) => void }>(
  Data: { new(): T },
) => new TypedTransform<FileBoxChunk, T>({
  objectMode: true,
  transform: (chunk: FileBoxChunk, _: any, callback: (error: Error | null, data: T) => void) => {
    const message = new Data()
    message.setFileBoxChunk(chunk)
    callback(null, message)
  },
})

function packFileBoxChunk<T extends { setFileBoxChunk: (chunk: FileBoxChunk) => void }> (
  stream: Readable<FileBoxChunk>,
  DataConstructor: { new(): T },
): Readable<T> {
  return stream.pipe(encoder(DataConstructor))
}

function unpackFileBoxChunk<T extends { getFileBoxChunk: () => FileBoxChunk | undefined }> (
  stream: Readable<T>,
): Readable<FileBoxChunk> {
  return stream.pipe(decoder())
}

const decoder = <T extends { getFileBoxChunk: () => FileBoxChunk | undefined }>() => new TypedTransform<T, FileBoxChunk>({
  objectMode: true,
  transform: (chunk: T, _: any, callback: (error: Error | null, data?: FileBoxChunk) => void) => {
    const fileBoxChunk = chunk.getFileBoxChunk()
    if (!fileBoxChunk) {
      callback(new Error('No FileBoxChunk'))
    } else {
      callback(null, fileBoxChunk)
    }
  },
})

export {
  packFileBoxChunk,
  unpackFileBoxChunk,
}

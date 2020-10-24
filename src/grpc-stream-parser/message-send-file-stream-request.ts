import { FileBox } from 'file-box'

import { PassThrough } from 'stream'

import {
  Readable,
  TypedTransform,
}                   from './typed-stream'
import { firstData } from './first-data'
import {
  toFileBox,
  toFileBoxChunk,
}                   from './to-file-box'

import {
  FileBoxChunk,
  MessageSendFileStreamRequest,
}                                     from '../../generated/proto-ts/my-proto_pb'

interface MessageSendFileStreamRequestArgs {
  conversationId: string,
  fileBox: FileBox,
}

const decoder = () => new TypedTransform<
  MessageSendFileStreamRequest,
  FileBoxChunk
>({
  transform: (chunk: MessageSendFileStreamRequest, _, callback) => {
    if (!chunk.hasFileBoxChunk()) {
      throw new Error('no file box chunk')
    }
    const fileBoxChunk = chunk.getFileBoxChunk()
    callback(null, fileBoxChunk)
  },
  objectMode: true,
})

async function toMessageSendFileStreamRequestArgs (
  stream: Readable<MessageSendFileStreamRequest>
): Promise<MessageSendFileStreamRequestArgs> {
  const chunk = await firstData(stream)
  if (!chunk.hasConversationId()) {
    throw new Error('no conversation id')
  }
  const conversationId = chunk.getConversationId()

  const fileBoxChunkStream = stream.pipe(decoder())
  const fileBox = await toFileBox(fileBoxChunkStream)

  return {
    conversationId,
    fileBox,
  }
}

const encoder = () => new TypedTransform<
  FileBoxChunk,
  MessageSendFileStreamRequest
> ({
  transform: (chunk: FileBoxChunk, _, callback) => {
    const req = new MessageSendFileStreamRequest()
    req.setFileBoxChunk(chunk)
    callback(null, req)
  },
  objectMode: true,
})

async function toMessageSendFileStreamRequest (
  conversationId: string,
  fileBox: FileBox,
): Promise<Readable<MessageSendFileStreamRequest>> {
  const stream = new PassThrough({ objectMode: true })

  const req1 = new MessageSendFileStreamRequest()
  req1.setConversationId(conversationId)
  stream.write(req1)

  const fileBoxChunkStream = await toFileBoxChunk(fileBox)
  fileBoxChunkStream
    .pipe(encoder())
    .pipe(stream)

  return stream
}

export {
  toMessageSendFileStreamRequestArgs,
  toMessageSendFileStreamRequest,
}

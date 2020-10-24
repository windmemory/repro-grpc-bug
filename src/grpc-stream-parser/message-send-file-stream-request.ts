import { FileBox } from 'file-box'

import {
  Readable,
  TypedTransform,
}                   from './typed-stream'
import { firstData } from './first-data'
import { toFileBox } from './to-file-box'

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
  transform: (chunk: MessageSendFileStreamRequest, controller) => {
    if (!chunk.hasFileBoxChunk()) {
      throw new Error('no file box chunk')
    }
    const fileBoxChunk = chunk.getFileBoxChunk()
    controller.enqueue(fileBoxChunk)
  }
})

async function messageSendFileStreamRequestArgs (
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

export {
  messageSendFileStreamRequestArgs,
}

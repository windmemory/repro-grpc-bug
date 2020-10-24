#!/usr/bin/env ts-node

/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import test  from 'tstest'

import { PassThrough } from 'stream'

import { FileBox } from 'file-box'

import {
  FileBoxChunk,
  MessageSendFileStreamRequest,
}                               from '../../generated/proto-ts/my-proto_pb'

import {
  toFileBox,
  toFileBoxChunk,
}                   from './to-file-box'
import { firstData } from './first-data'
import {
  toMessageSendFileStreamRequestArgs,
  toMessageSendFileStreamRequest,
}                                       from './message-send-file-stream-request'

test('toMessageSendFileStreamRequestArgs()', async t => {
  const FILE_BOX_DATA = 'test'
  const FILE_BOX_NAME = 'test.dat'
  const CONVERSATION_ID = 'conversation_id'

  const fileBox = FileBox.fromBuffer(
    Buffer.from(FILE_BOX_DATA),
    FILE_BOX_NAME,
  )

  const stream = new PassThrough({ objectMode: true })

  const req1 = new MessageSendFileStreamRequest()
  req1.setConversationId(CONVERSATION_ID)
  stream.write(req1)

  const req2 = new MessageSendFileStreamRequest()
  const chunk1 = new FileBoxChunk()
  chunk1.setName(fileBox.name)
  req2.setFileBoxChunk(chunk1)
  stream.write(req2)

  const fileBoxStream = await fileBox.toStream()
  fileBoxStream.on('data', chunk => {
    const fileBoxChunk = new FileBoxChunk()
    fileBoxChunk.setData(chunk)
    const req3 = new MessageSendFileStreamRequest()
    req3.setFileBoxChunk(fileBoxChunk)
    const ret = stream.write(req3)
  })
  fileBoxStream.on('end', () => stream.end())

  const args = await toMessageSendFileStreamRequestArgs(stream)
  const data = (await args.fileBox.toBuffer()).toString()

  t.equal(args.conversationId, CONVERSATION_ID, 'should get conversation id')
  t.equal(args.fileBox.name, FILE_BOX_NAME, 'should get file box name')
  t.equal(data, FILE_BOX_DATA, 'should get file box data')
})

test('toMessageSendFileStreamRequest()', async t => {
  const FILE_BOX_DATA = 'test'
  const FILE_BOX_NAME = 'test.dat'
  const CONVERSATION_ID = 'conv_id'

  const fileBox = FileBox.fromBuffer(
    Buffer.from(FILE_BOX_DATA),
    FILE_BOX_NAME,
  )

  const stream = await toMessageSendFileStreamRequest(
    CONVERSATION_ID,
    fileBox,
  )

  const data1 = await firstData(stream)
  t.equal(data1.getConversationId(), CONVERSATION_ID, 'match conversation id')

  const data2 = await firstData(stream)
  t.true(data2.hasFileBoxChunk(), 'has file box chunk')
  t.true(data2.getFileBoxChunk().hasName(), 'has file box name')
  t.equal(data2.getFileBoxChunk().getName(), FILE_BOX_NAME, 'match file box name')

  let data
  stream.on('data', (chunk: MessageSendFileStreamRequest) => {
    if (!chunk.hasFileBoxChunk()) {
      throw new Error('no file box chunk')
    }
    if (!chunk.getFileBoxChunk().hasData()) {
      throw new Error('no file box chunk data')
    }
    if (!data) {
      data = chunk.getFileBoxChunk().getData()
    } else {
      data += chunk.getFileBoxChunk().getData()
    }
  })

  await new Promise(resolve => stream.on('end', resolve))

  t.equal(data.toString(), FILE_BOX_DATA, 'should get file box data')
})

test('toMessageSendFileStreamRequestArgs() <-> toMessageSendFileStreamRequest()', async t => {
  const FILE_BOX_DATA = 'test'
  const FILE_BOX_NAME = 'test.dat'
  const CONVERSATION_ID = 'conv_id'

  const fileBox = FileBox.fromBuffer(
    Buffer.from(FILE_BOX_DATA),
    FILE_BOX_NAME,
  )

  const stream = await toMessageSendFileStreamRequest(CONVERSATION_ID, fileBox)
  const args = await toMessageSendFileStreamRequestArgs(stream)

  t.equal(args.conversationId, CONVERSATION_ID, 'should match conversation id')
  t.equal(args.fileBox.name, FILE_BOX_NAME, 'should be same name')
  t.equal(await (await args.fileBox.toBuffer()).toString(), FILE_BOX_DATA, 'should be same content')
})

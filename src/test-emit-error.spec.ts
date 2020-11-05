import test from 'blue-tape'
import { PassThrough } from 'stream'

test.only('dummy test for emit error', async t => {
  const stream = new PassThrough()
  stream.on('error', e => {
    console.warn(`It is okay, don\'t worry: ${e}`)
  })
  stream.emit('error', new Error('yo'))
  t.pass()
})

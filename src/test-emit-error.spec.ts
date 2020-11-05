import test from 'blue-tape'
import { PassThrough } from 'stream'

test.only('dummy test for emit error', t => {
  const stream = new PassThrough()
  stream.emit('error', new Error('yo'))
  stream.on('error', e => {
    console.warn(`It is okay, don\'t worry: ${e}`)
  })
  t.pass()
})

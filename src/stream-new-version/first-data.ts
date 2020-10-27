import {
  Readable,
}           from './typed-stream'

/**
 * windmemory(20201027): generating fileBox data in server side might take longer.
 * Set to 60 sec to avoid unexpected timeout.
 */
const TIMEOUT = 60 * 1000

async function firstData<T> (
  stream: Readable<T>
): Promise<T> {
  const chunk = await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(reject, TIMEOUT)
    stream.once('data', chunk => {
      stream.pause()
      clearTimeout(timer)

      resolve(chunk)
    })

  })
  stream.resume()
  return chunk
}

export {
  firstData,
}

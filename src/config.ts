import * as path from 'path'

export const FILE_PATH = path.join(
  __dirname,
  'test.json',
)

export const ENDPOINT = 'localhost:8788'

export const TOTAL_REQUEST = 10

export const GRPC_OPTIONS = {
  'grpc.max_receive_message_length': 1024 * 1024 * 150,
  'grpc.max_send_message_length': 1024 * 1024 * 150,
  'grpc.http2.max_frame_size': 16384,
  'grpc.http2.write_buffer_size': 1024,
  'grpc.experimental.tcp_min_read_chunk_size': 1024,
  'grpc.experimental.tcp_max_read_chunk_size': 1024,
}

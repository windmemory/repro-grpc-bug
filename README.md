# repro-grpc-bug

# What does this do?

This repo is trying to a minimal reproduce code to reproduce the bug that when `wechaty-puppet-hostie` transfer large file, the connection will be blocked by the file transfer, thus the heartbeat from the server to the client get blocked, and then results in a `dogReset` from `wechaty-puppet-hostie` client side.

# How to reproduce the bug

## Install dependencies

```shell
npm install
```

## Run the test
```shell
npm test
```

## Actually Behavior (10 concurrent requests with 100m data)

The log below is printing out the time in format: `mm:ss.SSS`(`minutes`:`second`.`milliseconds`)

The problem is when the server sends out the heartbeat, the client hasn't receive the data until all message file responses are sent

```shell
Data File not found, generating data file with default size: 100m
Successfully write 100m data into test.json
Server bind port: 8788
SERVER 59:26.708: send heartbeat
CLIENT 59:26.711: heartbeat
SERVER 59:26.810: send heartbeat
CLIENT 59:26.811: heartbeat
SERVER 59:26.913: send heartbeat
CLIENT 59:26.914: heartbeat
SERVER 59:27.014: send heartbeat
CLIENT 59:27.015: heartbeat
SERVER 59:27.115: send heartbeat
CLIENT 59:27.115: heartbeat
SERVER 59:27.215: send heartbeat # This event does not sent immediate to client
SERVER 59:27.216: receive request with id: 0
SERVER 59:27.216: message file sending response...
SERVER 59:29.304: message file response sent
SERVER 59:29.304: receive request with id: 1
SERVER 59:29.304: message file sending response...
SERVER 59:32.042: message file response sent
SERVER 59:32.335: receive request with id: 2
SERVER 59:32.335: message file sending response...
SERVER 59:34.504: message file response sent
SERVER 59:34.524: receive request with id: 3
SERVER 59:34.525: message file sending response...
SERVER 59:36.874: message file response sent
SERVER 59:37.177: receive request with id: 4
SERVER 59:37.177: message file sending response...
SERVER 59:39.488: message file response sent
SERVER 59:39.495: receive request with id: 5
SERVER 59:39.495: message file sending response...
SERVER 59:41.635: message file response sent
SERVER 59:41.992: receive request with id: 6
SERVER 59:41.992: message file sending response...
SERVER 59:44.279: message file response sent
SERVER 59:44.583: receive request with id: 7
SERVER 59:44.585: message file sending response...
SERVER 59:46.730: message file response sent
SERVER 59:46.730: receive request with id: 8
SERVER 59:46.730: message file sending response...
SERVER 59:49.002: message file response sent
SERVER 59:49.002: receive request with id: 9
SERVER 59:49.002: message file sending response...
SERVER 59:51.796: message file response sent
CLIENT 59:51.805: heartbeat # This is when the client receive the event that server sent at 59:27.215, which is almost 30 seconds after
CLIENT 59:53.265: id: 0 receive response with length: 100000000
CLIENT 59:54.607: id: 1 receive response with length: 100000000
CLIENT 59:56.133: id: 2 receive response with length: 100000000
CLIENT 59:57.606: id: 3 receive response with length: 100000000
CLIENT 59:59.291: id: 4 receive response with length: 100000000
CLIENT 00:00.817: id: 5 receive response with length: 100000000
CLIENT 00:02.362: id: 6 receive response with length: 100000000
CLIENT 00:04.001: id: 7 receive response with length: 100000000
CLIENT 00:05.487: id: 8 receive response with length: 100000000
CLIENT 00:07.176: id: 9 receive response with length: 100000000
```

## Expected behavior

- The server should periodically sent heartbeat no matter the message file api is called or not
- The client should receive the event no matter the message api is called or not

# How to change the file size passing from server to client
```shell
// Generate data file with size 10m
npm run str 10m

// Generate data file with size 10k
npm run str 10k
```

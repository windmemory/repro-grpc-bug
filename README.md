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

# How to change the file size passing from server to client
```shell
// Generate data file with size 10m
npm run str 10m

// Generate data file with size 10k
npm run str 10k
```

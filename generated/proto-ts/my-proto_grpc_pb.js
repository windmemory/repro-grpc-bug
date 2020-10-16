// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var my$proto_pb = require('./my-proto_pb.js');

function serialize_EventRequest(arg) {
  if (!(arg instanceof my$proto_pb.EventRequest)) {
    throw new Error('Expected argument of type EventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_EventRequest(buffer_arg) {
  return my$proto_pb.EventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_EventResponse(arg) {
  if (!(arg instanceof my$proto_pb.EventResponse)) {
    throw new Error('Expected argument of type EventResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_EventResponse(buffer_arg) {
  return my$proto_pb.EventResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MessageFileRequest(arg) {
  if (!(arg instanceof my$proto_pb.MessageFileRequest)) {
    throw new Error('Expected argument of type MessageFileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MessageFileRequest(buffer_arg) {
  return my$proto_pb.MessageFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MessageFileResponse(arg) {
  if (!(arg instanceof my$proto_pb.MessageFileResponse)) {
    throw new Error('Expected argument of type MessageFileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MessageFileResponse(buffer_arg) {
  return my$proto_pb.MessageFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MessageFileStreamRequest(arg) {
  if (!(arg instanceof my$proto_pb.MessageFileStreamRequest)) {
    throw new Error('Expected argument of type MessageFileStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MessageFileStreamRequest(buffer_arg) {
  return my$proto_pb.MessageFileStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_MessageFileStreamResponse(arg) {
  if (!(arg instanceof my$proto_pb.MessageFileStreamResponse)) {
    throw new Error('Expected argument of type MessageFileStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_MessageFileStreamResponse(buffer_arg) {
  return my$proto_pb.MessageFileStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var MyServiceService = exports.MyServiceService = {
  messageFile: {
    path: '/MyService/MessageFile',
    requestStream: false,
    responseStream: false,
    requestType: my$proto_pb.MessageFileRequest,
    responseType: my$proto_pb.MessageFileResponse,
    requestSerialize: serialize_MessageFileRequest,
    requestDeserialize: deserialize_MessageFileRequest,
    responseSerialize: serialize_MessageFileResponse,
    responseDeserialize: deserialize_MessageFileResponse,
  },
  messageFileStream: {
    path: '/MyService/MessageFileStream',
    requestStream: false,
    responseStream: true,
    requestType: my$proto_pb.MessageFileStreamRequest,
    responseType: my$proto_pb.MessageFileStreamResponse,
    requestSerialize: serialize_MessageFileStreamRequest,
    requestDeserialize: deserialize_MessageFileStreamRequest,
    responseSerialize: serialize_MessageFileStreamResponse,
    responseDeserialize: deserialize_MessageFileStreamResponse,
  },
  event: {
    path: '/MyService/Event',
    requestStream: false,
    responseStream: true,
    requestType: my$proto_pb.EventRequest,
    responseType: my$proto_pb.EventResponse,
    requestSerialize: serialize_EventRequest,
    requestDeserialize: deserialize_EventRequest,
    responseSerialize: serialize_EventResponse,
    responseDeserialize: deserialize_EventResponse,
  },
};

exports.MyServiceClient = grpc.makeGenericClientConstructor(MyServiceService);

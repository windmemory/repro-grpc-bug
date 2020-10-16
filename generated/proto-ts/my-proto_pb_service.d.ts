// package: 
// file: my-proto.proto

import * as my_proto_pb from "./my-proto_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MyServiceMessageFile = {
  readonly methodName: string;
  readonly service: typeof MyService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof my_proto_pb.MessageFileRequest;
  readonly responseType: typeof my_proto_pb.MessageFileResponse;
};

type MyServiceMessageFileStream = {
  readonly methodName: string;
  readonly service: typeof MyService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof my_proto_pb.MessageFileStreamRequest;
  readonly responseType: typeof my_proto_pb.MessageFileStreamResponse;
};

type MyServiceEvent = {
  readonly methodName: string;
  readonly service: typeof MyService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof my_proto_pb.EventRequest;
  readonly responseType: typeof my_proto_pb.EventResponse;
};

export class MyService {
  static readonly serviceName: string;
  static readonly MessageFile: MyServiceMessageFile;
  static readonly MessageFileStream: MyServiceMessageFileStream;
  static readonly Event: MyServiceEvent;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class MyServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  messageFile(
    requestMessage: my_proto_pb.MessageFileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: my_proto_pb.MessageFileResponse|null) => void
  ): UnaryResponse;
  messageFile(
    requestMessage: my_proto_pb.MessageFileRequest,
    callback: (error: ServiceError|null, responseMessage: my_proto_pb.MessageFileResponse|null) => void
  ): UnaryResponse;
  messageFileStream(requestMessage: my_proto_pb.MessageFileStreamRequest, metadata?: grpc.Metadata): ResponseStream<my_proto_pb.MessageFileStreamResponse>;
  event(requestMessage: my_proto_pb.EventRequest, metadata?: grpc.Metadata): ResponseStream<my_proto_pb.EventResponse>;
}


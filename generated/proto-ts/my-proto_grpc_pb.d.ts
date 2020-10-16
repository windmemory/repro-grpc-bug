// package: 
// file: my-proto.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as my_proto_pb from "./my-proto_pb";

interface IMyServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    messageFile: IMyServiceService_IMessageFile;
    messageFileStream: IMyServiceService_IMessageFileStream;
    event: IMyServiceService_IEvent;
}

interface IMyServiceService_IMessageFile extends grpc.MethodDefinition<my_proto_pb.MessageFileRequest, my_proto_pb.MessageFileResponse> {
    path: "/MyService/MessageFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<my_proto_pb.MessageFileRequest>;
    requestDeserialize: grpc.deserialize<my_proto_pb.MessageFileRequest>;
    responseSerialize: grpc.serialize<my_proto_pb.MessageFileResponse>;
    responseDeserialize: grpc.deserialize<my_proto_pb.MessageFileResponse>;
}
interface IMyServiceService_IMessageFileStream extends grpc.MethodDefinition<my_proto_pb.MessageFileStreamRequest, my_proto_pb.MessageFileStreamResponse> {
    path: "/MyService/MessageFileStream";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<my_proto_pb.MessageFileStreamRequest>;
    requestDeserialize: grpc.deserialize<my_proto_pb.MessageFileStreamRequest>;
    responseSerialize: grpc.serialize<my_proto_pb.MessageFileStreamResponse>;
    responseDeserialize: grpc.deserialize<my_proto_pb.MessageFileStreamResponse>;
}
interface IMyServiceService_IEvent extends grpc.MethodDefinition<my_proto_pb.EventRequest, my_proto_pb.EventResponse> {
    path: "/MyService/Event";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<my_proto_pb.EventRequest>;
    requestDeserialize: grpc.deserialize<my_proto_pb.EventRequest>;
    responseSerialize: grpc.serialize<my_proto_pb.EventResponse>;
    responseDeserialize: grpc.deserialize<my_proto_pb.EventResponse>;
}

export const MyServiceService: IMyServiceService;

export interface IMyServiceServer {
    messageFile: grpc.handleUnaryCall<my_proto_pb.MessageFileRequest, my_proto_pb.MessageFileResponse>;
    messageFileStream: grpc.handleServerStreamingCall<my_proto_pb.MessageFileStreamRequest, my_proto_pb.MessageFileStreamResponse>;
    event: grpc.handleServerStreamingCall<my_proto_pb.EventRequest, my_proto_pb.EventResponse>;
}

export interface IMyServiceClient {
    messageFile(request: my_proto_pb.MessageFileRequest, callback: (error: grpc.ServiceError | null, response: my_proto_pb.MessageFileResponse) => void): grpc.ClientUnaryCall;
    messageFile(request: my_proto_pb.MessageFileRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: my_proto_pb.MessageFileResponse) => void): grpc.ClientUnaryCall;
    messageFile(request: my_proto_pb.MessageFileRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: my_proto_pb.MessageFileResponse) => void): grpc.ClientUnaryCall;
    messageFileStream(request: my_proto_pb.MessageFileStreamRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.MessageFileStreamResponse>;
    messageFileStream(request: my_proto_pb.MessageFileStreamRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.MessageFileStreamResponse>;
    event(request: my_proto_pb.EventRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.EventResponse>;
    event(request: my_proto_pb.EventRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.EventResponse>;
}

export class MyServiceClient extends grpc.Client implements IMyServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public messageFile(request: my_proto_pb.MessageFileRequest, callback: (error: grpc.ServiceError | null, response: my_proto_pb.MessageFileResponse) => void): grpc.ClientUnaryCall;
    public messageFile(request: my_proto_pb.MessageFileRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: my_proto_pb.MessageFileResponse) => void): grpc.ClientUnaryCall;
    public messageFile(request: my_proto_pb.MessageFileRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: my_proto_pb.MessageFileResponse) => void): grpc.ClientUnaryCall;
    public messageFileStream(request: my_proto_pb.MessageFileStreamRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.MessageFileStreamResponse>;
    public messageFileStream(request: my_proto_pb.MessageFileStreamRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.MessageFileStreamResponse>;
    public event(request: my_proto_pb.EventRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.EventResponse>;
    public event(request: my_proto_pb.EventRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<my_proto_pb.EventResponse>;
}

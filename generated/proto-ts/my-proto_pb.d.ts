// package: 
// file: my-proto.proto

import * as jspb from "google-protobuf";

export class MessageFileResponse extends jspb.Message {
  getFilebox(): string;
  setFilebox(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageFileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MessageFileResponse): MessageFileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageFileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageFileResponse;
  static deserializeBinaryFromReader(message: MessageFileResponse, reader: jspb.BinaryReader): MessageFileResponse;
}

export namespace MessageFileResponse {
  export type AsObject = {
    filebox: string,
  }
}

export class MessageFileRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MessageFileRequest): MessageFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageFileRequest;
  static deserializeBinaryFromReader(message: MessageFileRequest, reader: jspb.BinaryReader): MessageFileRequest;
}

export namespace MessageFileRequest {
  export type AsObject = {
    id: string,
  }
}

export class EventRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EventRequest): EventRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventRequest;
  static deserializeBinaryFromReader(message: EventRequest, reader: jspb.BinaryReader): EventRequest;
}

export namespace EventRequest {
  export type AsObject = {
  }
}

export class EventResponse extends jspb.Message {
  getPayload(): string;
  setPayload(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EventResponse): EventResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventResponse;
  static deserializeBinaryFromReader(message: EventResponse, reader: jspb.BinaryReader): EventResponse;
}

export namespace EventResponse {
  export type AsObject = {
    payload: string,
  }
}


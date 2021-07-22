/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// package: TwoProcessConnector
// file: reader.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PingResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): PingResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PingResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PingResponse): PingResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PingResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PingResponse;
    static deserializeBinaryFromReader(message: PingResponse, reader: jspb.BinaryReader): PingResponse;
}

export namespace PingResponse {
    export type AsObject = {
        status: string,
    }
}

export class PingRequest extends jspb.Message { 
    getNop(): string;
    setNop(value: string): PingRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PingRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PingRequest): PingRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PingRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PingRequest;
    static deserializeBinaryFromReader(message: PingRequest, reader: jspb.BinaryReader): PingRequest;
}

export namespace PingRequest {
    export type AsObject = {
        nop: string,
    }
}

export class GetDataResponse extends jspb.Message { 
    getTestResponse(): string;
    setTestResponse(value: string): GetDataResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetDataResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetDataResponse): GetDataResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetDataResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetDataResponse;
    static deserializeBinaryFromReader(message: GetDataResponse, reader: jspb.BinaryReader): GetDataResponse;
}

export namespace GetDataResponse {
    export type AsObject = {
        testResponse: string,
    }
}

export class GetDataRequest extends jspb.Message { 
    getTestMessage(): string;
    setTestMessage(value: string): GetDataRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetDataRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetDataRequest): GetDataRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetDataRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetDataRequest;
    static deserializeBinaryFromReader(message: GetDataRequest, reader: jspb.BinaryReader): GetDataRequest;
}

export namespace GetDataRequest {
    export type AsObject = {
        testMessage: string,
    }
}

export class ShutdownResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): ShutdownResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ShutdownResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ShutdownResponse): ShutdownResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ShutdownResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ShutdownResponse;
    static deserializeBinaryFromReader(message: ShutdownResponse, reader: jspb.BinaryReader): ShutdownResponse;
}

export namespace ShutdownResponse {
    export type AsObject = {
        status: string,
    }
}

export class ShutdownRequest extends jspb.Message { 
    getOptions(): string;
    setOptions(value: string): ShutdownRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ShutdownRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ShutdownRequest): ShutdownRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ShutdownRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ShutdownRequest;
    static deserializeBinaryFromReader(message: ShutdownRequest, reader: jspb.BinaryReader): ShutdownRequest;
}

export namespace ShutdownRequest {
    export type AsObject = {
        options: string,
    }
}

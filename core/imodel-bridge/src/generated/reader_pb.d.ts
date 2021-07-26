/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// package: TwoProcessConnector
// file: reader.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class InitializeResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): InitializeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitializeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: InitializeResponse): InitializeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitializeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitializeResponse;
    static deserializeBinaryFromReader(message: InitializeResponse, reader: jspb.BinaryReader): InitializeResponse;
}

export namespace InitializeResponse {
    export type AsObject = {
        status: string,
    }
}

export class InitializeRequest extends jspb.Message { 
    getFilename(): string;
    setFilename(value: string): InitializeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitializeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InitializeRequest): InitializeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitializeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitializeRequest;
    static deserializeBinaryFromReader(message: InitializeRequest, reader: jspb.BinaryReader): InitializeRequest;
}

export namespace InitializeRequest {
    export type AsObject = {
        filename: string,
    }
}

export class GetDataResponse extends jspb.Message { 
    getData(): string;
    setData(value: string): GetDataResponse;

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
        data: string,
    }
}

export class GetDataRequest extends jspb.Message { 
    getReq(): string;
    setReq(value: string): GetDataRequest;

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
        req: string,
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

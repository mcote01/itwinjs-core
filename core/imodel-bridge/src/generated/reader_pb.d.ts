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

export class InitializeResponse extends jspb.Message { 

    hasFailurereason(): boolean;
    clearFailurereason(): void;
    getFailurereason(): string | undefined;
    setFailurereason(value: string): InitializeResponse;

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
        failurereason?: string,
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

export class OnBriefcaseServerAvailableParams extends jspb.Message { 
    getAddress(): string;
    setAddress(value: string): OnBriefcaseServerAvailableParams;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OnBriefcaseServerAvailableParams.AsObject;
    static toObject(includeInstance: boolean, msg: OnBriefcaseServerAvailableParams): OnBriefcaseServerAvailableParams.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OnBriefcaseServerAvailableParams, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OnBriefcaseServerAvailableParams;
    static deserializeBinaryFromReader(message: OnBriefcaseServerAvailableParams, reader: jspb.BinaryReader): OnBriefcaseServerAvailableParams;
}

export namespace OnBriefcaseServerAvailableParams {
    export type AsObject = {
        address: string,
    }
}

export class ShutdownRequest extends jspb.Message { 
    getStatus(): number;
    setStatus(value: number): ShutdownRequest;

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
        status: number,
    }
}

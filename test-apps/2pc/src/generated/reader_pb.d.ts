/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// package: TwoProcessConnector
// file: reader.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class TestResponse extends jspb.Message { 
    getTestResponse(): string;
    setTestResponse(value: string): TestResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TestResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TestResponse): TestResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TestResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TestResponse;
    static deserializeBinaryFromReader(message: TestResponse, reader: jspb.BinaryReader): TestResponse;
}

export namespace TestResponse {
    export type AsObject = {
        testResponse: string,
    }
}

export class TestRequest extends jspb.Message { 
    getTestMessage(): string;
    setTestMessage(value: string): TestRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TestRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TestRequest): TestRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TestRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TestRequest;
    static deserializeBinaryFromReader(message: TestRequest, reader: jspb.BinaryReader): TestRequest;
}

export namespace TestRequest {
    export type AsObject = {
        testMessage: string,
    }
}

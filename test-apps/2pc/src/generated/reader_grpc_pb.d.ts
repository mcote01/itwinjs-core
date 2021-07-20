/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// package: TwoProcessConnector
// file: reader.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as reader_pb from "./reader_pb";

interface IReaderService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sww: IReaderService_Isww;
}

interface IReaderService_Isww extends grpc.MethodDefinition<reader_pb.TestRequest, reader_pb.TestResponse> {
    path: "/TwoProcessConnector.Reader/sww";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<reader_pb.TestRequest>;
    requestDeserialize: grpc.deserialize<reader_pb.TestRequest>;
    responseSerialize: grpc.serialize<reader_pb.TestResponse>;
    responseDeserialize: grpc.deserialize<reader_pb.TestResponse>;
}

export const ReaderService: IReaderService;

export interface IReaderServer extends grpc.UntypedServiceImplementation {
    sww: grpc.handleServerStreamingCall<reader_pb.TestRequest, reader_pb.TestResponse>;
}

export interface IReaderClient {
    sww(request: reader_pb.TestRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
    sww(request: reader_pb.TestRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
}

export class ReaderClient extends grpc.Client implements IReaderClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sww(request: reader_pb.TestRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
    public sww(request: reader_pb.TestRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
}

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
    ping: IReaderService_Iping;
    sww: IReaderService_Isww;
    shutdown: IReaderService_Ishutdown;
}

interface IReaderService_Iping extends grpc.MethodDefinition<reader_pb.PingRequest, reader_pb.PingResponse> {
    path: "/TwoProcessConnector.Reader/ping";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<reader_pb.PingRequest>;
    requestDeserialize: grpc.deserialize<reader_pb.PingRequest>;
    responseSerialize: grpc.serialize<reader_pb.PingResponse>;
    responseDeserialize: grpc.deserialize<reader_pb.PingResponse>;
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
interface IReaderService_Ishutdown extends grpc.MethodDefinition<reader_pb.ShutdownRequest, reader_pb.ShutdownResponse> {
    path: "/TwoProcessConnector.Reader/shutdown";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<reader_pb.ShutdownRequest>;
    requestDeserialize: grpc.deserialize<reader_pb.ShutdownRequest>;
    responseSerialize: grpc.serialize<reader_pb.ShutdownResponse>;
    responseDeserialize: grpc.deserialize<reader_pb.ShutdownResponse>;
}

export const ReaderService: IReaderService;

export interface IReaderServer extends grpc.UntypedServiceImplementation {
    ping: grpc.handleUnaryCall<reader_pb.PingRequest, reader_pb.PingResponse>;
    sww: grpc.handleServerStreamingCall<reader_pb.TestRequest, reader_pb.TestResponse>;
    shutdown: grpc.handleUnaryCall<reader_pb.ShutdownRequest, reader_pb.ShutdownResponse>;
}

export interface IReaderClient {
    ping(request: reader_pb.PingRequest, callback: (error: grpc.ServiceError | null, response: reader_pb.PingResponse) => void): grpc.ClientUnaryCall;
    ping(request: reader_pb.PingRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: reader_pb.PingResponse) => void): grpc.ClientUnaryCall;
    ping(request: reader_pb.PingRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: reader_pb.PingResponse) => void): grpc.ClientUnaryCall;
    sww(request: reader_pb.TestRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
    sww(request: reader_pb.TestRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
    shutdown(request: reader_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: reader_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: reader_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: reader_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
}

export class ReaderClient extends grpc.Client implements IReaderClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public ping(request: reader_pb.PingRequest, callback: (error: grpc.ServiceError | null, response: reader_pb.PingResponse) => void): grpc.ClientUnaryCall;
    public ping(request: reader_pb.PingRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: reader_pb.PingResponse) => void): grpc.ClientUnaryCall;
    public ping(request: reader_pb.PingRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: reader_pb.PingResponse) => void): grpc.ClientUnaryCall;
    public sww(request: reader_pb.TestRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
    public sww(request: reader_pb.TestRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.TestResponse>;
    public shutdown(request: reader_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: reader_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: reader_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: reader_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
}

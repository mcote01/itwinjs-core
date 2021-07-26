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
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IReaderService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    initialize: IReaderService_Iinitialize;
    onBriefcaseServerAvailable: IReaderService_IonBriefcaseServerAvailable;
    getData: IReaderService_IgetData;
    shutdown: IReaderService_Ishutdown;
}

interface IReaderService_Iinitialize extends grpc.MethodDefinition<reader_pb.InitializeRequest, reader_pb.InitializeResponse> {
    path: "/TwoProcessConnector.Reader/initialize";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<reader_pb.InitializeRequest>;
    requestDeserialize: grpc.deserialize<reader_pb.InitializeRequest>;
    responseSerialize: grpc.serialize<reader_pb.InitializeResponse>;
    responseDeserialize: grpc.deserialize<reader_pb.InitializeResponse>;
}
interface IReaderService_IonBriefcaseServerAvailable extends grpc.MethodDefinition<reader_pb.OnBriefcaseServerAvailableParams, google_protobuf_empty_pb.Empty> {
    path: "/TwoProcessConnector.Reader/onBriefcaseServerAvailable";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<reader_pb.OnBriefcaseServerAvailableParams>;
    requestDeserialize: grpc.deserialize<reader_pb.OnBriefcaseServerAvailableParams>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IReaderService_IgetData extends grpc.MethodDefinition<reader_pb.GetDataRequest, reader_pb.GetDataResponse> {
    path: "/TwoProcessConnector.Reader/getData";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<reader_pb.GetDataRequest>;
    requestDeserialize: grpc.deserialize<reader_pb.GetDataRequest>;
    responseSerialize: grpc.serialize<reader_pb.GetDataResponse>;
    responseDeserialize: grpc.deserialize<reader_pb.GetDataResponse>;
}
interface IReaderService_Ishutdown extends grpc.MethodDefinition<reader_pb.ShutdownRequest, google_protobuf_empty_pb.Empty> {
    path: "/TwoProcessConnector.Reader/shutdown";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<reader_pb.ShutdownRequest>;
    requestDeserialize: grpc.deserialize<reader_pb.ShutdownRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const ReaderService: IReaderService;

export interface IReaderServer extends grpc.UntypedServiceImplementation {
    initialize: grpc.handleUnaryCall<reader_pb.InitializeRequest, reader_pb.InitializeResponse>;
    onBriefcaseServerAvailable: grpc.handleUnaryCall<reader_pb.OnBriefcaseServerAvailableParams, google_protobuf_empty_pb.Empty>;
    getData: grpc.handleServerStreamingCall<reader_pb.GetDataRequest, reader_pb.GetDataResponse>;
    shutdown: grpc.handleUnaryCall<reader_pb.ShutdownRequest, google_protobuf_empty_pb.Empty>;
}

export interface IReaderClient {
    initialize(request: reader_pb.InitializeRequest, callback: (error: grpc.ServiceError | null, response: reader_pb.InitializeResponse) => void): grpc.ClientUnaryCall;
    initialize(request: reader_pb.InitializeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: reader_pb.InitializeResponse) => void): grpc.ClientUnaryCall;
    initialize(request: reader_pb.InitializeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: reader_pb.InitializeResponse) => void): grpc.ClientUnaryCall;
    onBriefcaseServerAvailable(request: reader_pb.OnBriefcaseServerAvailableParams, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    onBriefcaseServerAvailable(request: reader_pb.OnBriefcaseServerAvailableParams, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    onBriefcaseServerAvailable(request: reader_pb.OnBriefcaseServerAvailableParams, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    getData(request: reader_pb.GetDataRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.GetDataResponse>;
    getData(request: reader_pb.GetDataRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.GetDataResponse>;
    shutdown(request: reader_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class ReaderClient extends grpc.Client implements IReaderClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public initialize(request: reader_pb.InitializeRequest, callback: (error: grpc.ServiceError | null, response: reader_pb.InitializeResponse) => void): grpc.ClientUnaryCall;
    public initialize(request: reader_pb.InitializeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: reader_pb.InitializeResponse) => void): grpc.ClientUnaryCall;
    public initialize(request: reader_pb.InitializeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: reader_pb.InitializeResponse) => void): grpc.ClientUnaryCall;
    public onBriefcaseServerAvailable(request: reader_pb.OnBriefcaseServerAvailableParams, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public onBriefcaseServerAvailable(request: reader_pb.OnBriefcaseServerAvailableParams, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public onBriefcaseServerAvailable(request: reader_pb.OnBriefcaseServerAvailableParams, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public getData(request: reader_pb.GetDataRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.GetDataResponse>;
    public getData(request: reader_pb.GetDataRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<reader_pb.GetDataResponse>;
    public shutdown(request: reader_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public shutdown(request: reader_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// package: TwoProcessConnector
// file: briefcase.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as briefcase_pb from "./briefcase_pb";

interface IBriefcaseService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    detectChange: IBriefcaseService_IDetectChange;
    tryGetElementProps: IBriefcaseService_ITryGetElementProps;
    getExternalSourceAspectProps: IBriefcaseService_IGetExternalSourceAspectProps;
}

interface IBriefcaseService_IDetectChange extends grpc.MethodDefinition<briefcase_pb.DetectChangeRequest, briefcase_pb.DetectChangeResult> {
    path: "/TwoProcessConnector.Briefcase/DetectChange";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<briefcase_pb.DetectChangeRequest>;
    requestDeserialize: grpc.deserialize<briefcase_pb.DetectChangeRequest>;
    responseSerialize: grpc.serialize<briefcase_pb.DetectChangeResult>;
    responseDeserialize: grpc.deserialize<briefcase_pb.DetectChangeResult>;
}
interface IBriefcaseService_ITryGetElementProps extends grpc.MethodDefinition<briefcase_pb.TryGetElementPropsRequest, briefcase_pb.ElementProps> {
    path: "/TwoProcessConnector.Briefcase/TryGetElementProps";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<briefcase_pb.TryGetElementPropsRequest>;
    requestDeserialize: grpc.deserialize<briefcase_pb.TryGetElementPropsRequest>;
    responseSerialize: grpc.serialize<briefcase_pb.ElementProps>;
    responseDeserialize: grpc.deserialize<briefcase_pb.ElementProps>;
}
interface IBriefcaseService_IGetExternalSourceAspectProps extends grpc.MethodDefinition<briefcase_pb.GetExternalSourceAspectPropsRequest, briefcase_pb.ExternalSourceAspectProps> {
    path: "/TwoProcessConnector.Briefcase/GetExternalSourceAspectProps";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<briefcase_pb.GetExternalSourceAspectPropsRequest>;
    requestDeserialize: grpc.deserialize<briefcase_pb.GetExternalSourceAspectPropsRequest>;
    responseSerialize: grpc.serialize<briefcase_pb.ExternalSourceAspectProps>;
    responseDeserialize: grpc.deserialize<briefcase_pb.ExternalSourceAspectProps>;
}

export const BriefcaseService: IBriefcaseService;

export interface IBriefcaseServer extends grpc.UntypedServiceImplementation {
    detectChange: grpc.handleUnaryCall<briefcase_pb.DetectChangeRequest, briefcase_pb.DetectChangeResult>;
    tryGetElementProps: grpc.handleUnaryCall<briefcase_pb.TryGetElementPropsRequest, briefcase_pb.ElementProps>;
    getExternalSourceAspectProps: grpc.handleUnaryCall<briefcase_pb.GetExternalSourceAspectPropsRequest, briefcase_pb.ExternalSourceAspectProps>;
}

export interface IBriefcaseClient {
    detectChange(request: briefcase_pb.DetectChangeRequest, callback: (error: grpc.ServiceError | null, response: briefcase_pb.DetectChangeResult) => void): grpc.ClientUnaryCall;
    detectChange(request: briefcase_pb.DetectChangeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: briefcase_pb.DetectChangeResult) => void): grpc.ClientUnaryCall;
    detectChange(request: briefcase_pb.DetectChangeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: briefcase_pb.DetectChangeResult) => void): grpc.ClientUnaryCall;
    tryGetElementProps(request: briefcase_pb.TryGetElementPropsRequest, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ElementProps) => void): grpc.ClientUnaryCall;
    tryGetElementProps(request: briefcase_pb.TryGetElementPropsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ElementProps) => void): grpc.ClientUnaryCall;
    tryGetElementProps(request: briefcase_pb.TryGetElementPropsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ElementProps) => void): grpc.ClientUnaryCall;
    getExternalSourceAspectProps(request: briefcase_pb.GetExternalSourceAspectPropsRequest, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ExternalSourceAspectProps) => void): grpc.ClientUnaryCall;
    getExternalSourceAspectProps(request: briefcase_pb.GetExternalSourceAspectPropsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ExternalSourceAspectProps) => void): grpc.ClientUnaryCall;
    getExternalSourceAspectProps(request: briefcase_pb.GetExternalSourceAspectPropsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ExternalSourceAspectProps) => void): grpc.ClientUnaryCall;
}

export class BriefcaseClient extends grpc.Client implements IBriefcaseClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public detectChange(request: briefcase_pb.DetectChangeRequest, callback: (error: grpc.ServiceError | null, response: briefcase_pb.DetectChangeResult) => void): grpc.ClientUnaryCall;
    public detectChange(request: briefcase_pb.DetectChangeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: briefcase_pb.DetectChangeResult) => void): grpc.ClientUnaryCall;
    public detectChange(request: briefcase_pb.DetectChangeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: briefcase_pb.DetectChangeResult) => void): grpc.ClientUnaryCall;
    public tryGetElementProps(request: briefcase_pb.TryGetElementPropsRequest, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ElementProps) => void): grpc.ClientUnaryCall;
    public tryGetElementProps(request: briefcase_pb.TryGetElementPropsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ElementProps) => void): grpc.ClientUnaryCall;
    public tryGetElementProps(request: briefcase_pb.TryGetElementPropsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ElementProps) => void): grpc.ClientUnaryCall;
    public getExternalSourceAspectProps(request: briefcase_pb.GetExternalSourceAspectPropsRequest, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ExternalSourceAspectProps) => void): grpc.ClientUnaryCall;
    public getExternalSourceAspectProps(request: briefcase_pb.GetExternalSourceAspectPropsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ExternalSourceAspectProps) => void): grpc.ClientUnaryCall;
    public getExternalSourceAspectProps(request: briefcase_pb.GetExternalSourceAspectPropsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: briefcase_pb.ExternalSourceAspectProps) => void): grpc.ClientUnaryCall;
}

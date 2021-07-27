/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var briefcase_pb = require('./briefcase_pb.js');

function serialize_TwoProcessConnector_DetectChangeRequest(arg) {
  if (!(arg instanceof briefcase_pb.DetectChangeRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.DetectChangeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_DetectChangeRequest(buffer_arg) {
  return briefcase_pb.DetectChangeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_DetectChangeResult(arg) {
  if (!(arg instanceof briefcase_pb.DetectChangeResult)) {
    throw new Error('Expected argument of type TwoProcessConnector.DetectChangeResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_DetectChangeResult(buffer_arg) {
  return briefcase_pb.DetectChangeResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_ElementProps(arg) {
  if (!(arg instanceof briefcase_pb.ElementProps)) {
    throw new Error('Expected argument of type TwoProcessConnector.ElementProps');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ElementProps(buffer_arg) {
  return briefcase_pb.ElementProps.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_ExternalSourceAspectProps(arg) {
  if (!(arg instanceof briefcase_pb.ExternalSourceAspectProps)) {
    throw new Error('Expected argument of type TwoProcessConnector.ExternalSourceAspectProps');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ExternalSourceAspectProps(buffer_arg) {
  return briefcase_pb.ExternalSourceAspectProps.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_GetExternalSourceAspectPropsRequest(arg) {
  if (!(arg instanceof briefcase_pb.GetExternalSourceAspectPropsRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.GetExternalSourceAspectPropsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_GetExternalSourceAspectPropsRequest(buffer_arg) {
  return briefcase_pb.GetExternalSourceAspectPropsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_TryGetElementPropsRequest(arg) {
  if (!(arg instanceof briefcase_pb.TryGetElementPropsRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.TryGetElementPropsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_TryGetElementPropsRequest(buffer_arg) {
  return briefcase_pb.TryGetElementPropsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// Query an iModel Briefcase
var BriefcaseService = exports.BriefcaseService = {
  // Detect if the specified external data is mapped to an element and, if so, if the last-recorded state of the data is different from its current state. 
detectChange: {
    path: '/TwoProcessConnector.Briefcase/DetectChange',
    requestStream: false,
    responseStream: false,
    requestType: briefcase_pb.DetectChangeRequest,
    responseType: briefcase_pb.DetectChangeResult,
    requestSerialize: serialize_TwoProcessConnector_DetectChangeRequest,
    requestDeserialize: deserialize_TwoProcessConnector_DetectChangeRequest,
    responseSerialize: serialize_TwoProcessConnector_DetectChangeResult,
    responseDeserialize: deserialize_TwoProcessConnector_DetectChangeResult,
  },
  // Look up an element in the iModel 
tryGetElementProps: {
    path: '/TwoProcessConnector.Briefcase/TryGetElementProps',
    requestStream: false,
    responseStream: false,
    requestType: briefcase_pb.TryGetElementPropsRequest,
    responseType: briefcase_pb.ElementProps,
    requestSerialize: serialize_TwoProcessConnector_TryGetElementPropsRequest,
    requestDeserialize: deserialize_TwoProcessConnector_TryGetElementPropsRequest,
    responseSerialize: serialize_TwoProcessConnector_ElementProps,
    responseDeserialize: deserialize_TwoProcessConnector_ElementProps,
  },
  // Get the properties of an ExernalSourceAspect. See DetectChange for how to get the input externalSourceAspectId. 
getExternalSourceAspectProps: {
    path: '/TwoProcessConnector.Briefcase/GetExternalSourceAspectProps',
    requestStream: false,
    responseStream: false,
    requestType: briefcase_pb.GetExternalSourceAspectPropsRequest,
    responseType: briefcase_pb.ExternalSourceAspectProps,
    requestSerialize: serialize_TwoProcessConnector_GetExternalSourceAspectPropsRequest,
    requestDeserialize: deserialize_TwoProcessConnector_GetExternalSourceAspectPropsRequest,
    responseSerialize: serialize_TwoProcessConnector_ExternalSourceAspectProps,
    responseDeserialize: deserialize_TwoProcessConnector_ExternalSourceAspectProps,
  },
};

exports.BriefcaseClient = grpc.makeGenericClientConstructor(BriefcaseService);

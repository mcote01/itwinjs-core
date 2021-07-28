/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
//
// This interface is implemented by the iModel.js program and is called by a non-iModel.js program.
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

function serialize_TwoProcessConnector_ExecuteECSqlRequest(arg) {
  if (!(arg instanceof briefcase_pb.ExecuteECSqlRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.ExecuteECSqlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ExecuteECSqlRequest(buffer_arg) {
  return briefcase_pb.ExecuteECSqlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_ExecuteECSqlResult(arg) {
  if (!(arg instanceof briefcase_pb.ExecuteECSqlResult)) {
    throw new Error('Expected argument of type TwoProcessConnector.ExecuteECSqlResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ExecuteECSqlResult(buffer_arg) {
  return briefcase_pb.ExecuteECSqlResult.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_TwoProcessConnector_TryGetElementPropsResult(arg) {
  if (!(arg instanceof briefcase_pb.TryGetElementPropsResult)) {
    throw new Error('Expected argument of type TwoProcessConnector.TryGetElementPropsResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_TryGetElementPropsResult(buffer_arg) {
  return briefcase_pb.TryGetElementPropsResult.deserializeBinary(new Uint8Array(buffer_arg));
}


// Query an iModel Briefcase.
// The functions in this service allow a non-iModel.js server to get information from an open briefcase.
// ExecuteECSql is the basic and most general method of querying the iModel.
// TryGetElementProps is a simplified method to get the properties of an element.
// GetExternalSourceAspectProps is specialized to getting the properties of an ExternalSourceAspect, and its results is strongly typed.
// DetectChange is a short-cut query that looks up an ExternalSourceAspect by its external identity and checks its version or checksum.
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
  // Look up an element in the iModel. 
tryGetElementProps: {
    path: '/TwoProcessConnector.Briefcase/TryGetElementProps',
    requestStream: false,
    responseStream: false,
    requestType: briefcase_pb.TryGetElementPropsRequest,
    responseType: briefcase_pb.TryGetElementPropsResult,
    requestSerialize: serialize_TwoProcessConnector_TryGetElementPropsRequest,
    requestDeserialize: deserialize_TwoProcessConnector_TryGetElementPropsRequest,
    responseSerialize: serialize_TwoProcessConnector_TryGetElementPropsResult,
    responseDeserialize: deserialize_TwoProcessConnector_TryGetElementPropsResult,
  },
  // Get the properties of an ExernalSourceAspect. If not found, all of the properties of the returned object will have default values (i.e., elementId will be empty). See DetectChange for how to get the input externalSourceAspectId. 
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
  // Execute an ECSql statement 
executeECSql: {
    path: '/TwoProcessConnector.Briefcase/ExecuteECSql',
    requestStream: false,
    responseStream: false,
    requestType: briefcase_pb.ExecuteECSqlRequest,
    responseType: briefcase_pb.ExecuteECSqlResult,
    requestSerialize: serialize_TwoProcessConnector_ExecuteECSqlRequest,
    requestDeserialize: deserialize_TwoProcessConnector_ExecuteECSqlRequest,
    responseSerialize: serialize_TwoProcessConnector_ExecuteECSqlResult,
    responseDeserialize: deserialize_TwoProcessConnector_ExecuteECSqlResult,
  },
};

exports.BriefcaseClient = grpc.makeGenericClientConstructor(BriefcaseService);

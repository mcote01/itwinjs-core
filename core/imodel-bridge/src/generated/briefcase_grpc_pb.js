/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var briefcase_pb = require('./briefcase_pb.js');

function serialize_TwoProcessConnector_ElementProps(arg) {
  if (!(arg instanceof briefcase_pb.ElementProps)) {
    throw new Error('Expected argument of type TwoProcessConnector.ElementProps');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ElementProps(buffer_arg) {
  return briefcase_pb.ElementProps.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_ExternalSourceAspectIdentifier(arg) {
  if (!(arg instanceof briefcase_pb.ExternalSourceAspectIdentifier)) {
    throw new Error('Expected argument of type TwoProcessConnector.ExternalSourceAspectIdentifier');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ExternalSourceAspectIdentifier(buffer_arg) {
  return briefcase_pb.ExternalSourceAspectIdentifier.deserializeBinary(new Uint8Array(buffer_arg));
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
  // Get the properties of an ExernalSourceAspect 
getExternalSourceAspectProps: {
    path: '/TwoProcessConnector.Briefcase/GetExternalSourceAspectProps',
    requestStream: false,
    responseStream: false,
    requestType: briefcase_pb.ExternalSourceAspectIdentifier,
    responseType: briefcase_pb.ExternalSourceAspectProps,
    requestSerialize: serialize_TwoProcessConnector_ExternalSourceAspectIdentifier,
    requestDeserialize: deserialize_TwoProcessConnector_ExternalSourceAspectIdentifier,
    responseSerialize: serialize_TwoProcessConnector_ExternalSourceAspectProps,
    responseDeserialize: deserialize_TwoProcessConnector_ExternalSourceAspectProps,
  },
};

exports.BriefcaseClient = grpc.makeGenericClientConstructor(BriefcaseService);

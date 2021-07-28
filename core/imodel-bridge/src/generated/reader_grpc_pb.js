/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
//
// This interface is implemented by a non-iModel.js program and is called by an iModel.js program.
'use strict';
var grpc = require('@grpc/grpc-js');
var reader_pb = require('./reader_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_TwoProcessConnector_GetDataRequest(arg) {
  if (!(arg instanceof reader_pb.GetDataRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.GetDataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_GetDataRequest(buffer_arg) {
  return reader_pb.GetDataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_GetDataResponse(arg) {
  if (!(arg instanceof reader_pb.GetDataResponse)) {
    throw new Error('Expected argument of type TwoProcessConnector.GetDataResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_GetDataResponse(buffer_arg) {
  return reader_pb.GetDataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_InitializeRequest(arg) {
  if (!(arg instanceof reader_pb.InitializeRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.InitializeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_InitializeRequest(buffer_arg) {
  return reader_pb.InitializeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_InitializeResponse(arg) {
  if (!(arg instanceof reader_pb.InitializeResponse)) {
    throw new Error('Expected argument of type TwoProcessConnector.InitializeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_InitializeResponse(buffer_arg) {
  return reader_pb.InitializeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_OnBriefcaseServerAvailableParams(arg) {
  if (!(arg instanceof reader_pb.OnBriefcaseServerAvailableParams)) {
    throw new Error('Expected argument of type TwoProcessConnector.OnBriefcaseServerAvailableParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_OnBriefcaseServerAvailableParams(buffer_arg) {
  return reader_pb.OnBriefcaseServerAvailableParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_ShutdownRequest(arg) {
  if (!(arg instanceof reader_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.ShutdownRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ShutdownRequest(buffer_arg) {
  return reader_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


// Query an external source.
// The functions in this service are implemented by a non-iModel.js "reader" program. They are called by an iModel.js connector. They
// give the iModel.js connector a way to fetch data from an external source that is not directly accessible to it. The "reader" program is the intermediary.
// The main function is `getData`. The reader program should implement this by *streaming* all of the data in the external source back to the requesting connector.
// The `onBriefcaseServerAvailable` function gives the reader the address of a service that is implemented by the iModel.js program. See briefcase.proto.
// The reader program can use the briefcase service to send queries back to the connector. The reader can even send briefcase requests to the connector (and wait for answers)
// while in the midst of handling a request from the connector.
var ReaderService = exports.ReaderService = {
  // Tell the reader to initialize. The input file to the connector is passed as a parameter, in case the Reader wants to open that or use it in some way. 
initialize: {
    path: '/TwoProcessConnector.Reader/initialize',
    requestStream: false,
    responseStream: false,
    requestType: reader_pb.InitializeRequest,
    responseType: reader_pb.InitializeResponse,
    requestSerialize: serialize_TwoProcessConnector_InitializeRequest,
    requestDeserialize: deserialize_TwoProcessConnector_InitializeRequest,
    responseSerialize: serialize_TwoProcessConnector_InitializeResponse,
    responseDeserialize: deserialize_TwoProcessConnector_InitializeResponse,
  },
  // Inform the Reader that a server is now available to take requests to query the briefcase 
onBriefcaseServerAvailable: {
    path: '/TwoProcessConnector.Reader/onBriefcaseServerAvailable',
    requestStream: false,
    responseStream: false,
    requestType: reader_pb.OnBriefcaseServerAvailableParams,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_TwoProcessConnector_OnBriefcaseServerAvailableParams,
    requestDeserialize: deserialize_TwoProcessConnector_OnBriefcaseServerAvailableParams,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // The Reader should send the data in the external source to the client (in a stream) 
getData: {
    path: '/TwoProcessConnector.Reader/getData',
    requestStream: false,
    responseStream: true,
    requestType: reader_pb.GetDataRequest,
    responseType: reader_pb.GetDataResponse,
    requestSerialize: serialize_TwoProcessConnector_GetDataRequest,
    requestDeserialize: deserialize_TwoProcessConnector_GetDataRequest,
    responseSerialize: serialize_TwoProcessConnector_GetDataResponse,
    responseDeserialize: deserialize_TwoProcessConnector_GetDataResponse,
  },
  // The Reader should shut down 
shutdown: {
    path: '/TwoProcessConnector.Reader/shutdown',
    requestStream: false,
    responseStream: false,
    requestType: reader_pb.ShutdownRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_TwoProcessConnector_ShutdownRequest,
    requestDeserialize: deserialize_TwoProcessConnector_ShutdownRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.ReaderClient = grpc.makeGenericClientConstructor(ReaderService);

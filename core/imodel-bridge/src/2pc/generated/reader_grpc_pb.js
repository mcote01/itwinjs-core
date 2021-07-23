/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var reader_pb = require('./reader_pb.js');

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

function serialize_TwoProcessConnector_ShutdownRequest(arg) {
  if (!(arg instanceof reader_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.ShutdownRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ShutdownRequest(buffer_arg) {
  return reader_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_ShutdownResponse(arg) {
  if (!(arg instanceof reader_pb.ShutdownResponse)) {
    throw new Error('Expected argument of type TwoProcessConnector.ShutdownResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_ShutdownResponse(buffer_arg) {
  return reader_pb.ShutdownResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ReaderService = exports.ReaderService = {
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
  shutdown: {
    path: '/TwoProcessConnector.Reader/shutdown',
    requestStream: false,
    responseStream: false,
    requestType: reader_pb.ShutdownRequest,
    responseType: reader_pb.ShutdownResponse,
    requestSerialize: serialize_TwoProcessConnector_ShutdownRequest,
    requestDeserialize: deserialize_TwoProcessConnector_ShutdownRequest,
    responseSerialize: serialize_TwoProcessConnector_ShutdownResponse,
    responseDeserialize: deserialize_TwoProcessConnector_ShutdownResponse,
  },
};

exports.ReaderClient = grpc.makeGenericClientConstructor(ReaderService);

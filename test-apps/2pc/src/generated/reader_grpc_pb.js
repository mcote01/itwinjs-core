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

function serialize_TwoProcessConnector_PingRequest(arg) {
  if (!(arg instanceof reader_pb.PingRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.PingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_PingRequest(buffer_arg) {
  return reader_pb.PingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_PingResponse(arg) {
  if (!(arg instanceof reader_pb.PingResponse)) {
    throw new Error('Expected argument of type TwoProcessConnector.PingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_PingResponse(buffer_arg) {
  return reader_pb.PingResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  ping: {
    path: '/TwoProcessConnector.Reader/ping',
    requestStream: false,
    responseStream: false,
    requestType: reader_pb.PingRequest,
    responseType: reader_pb.PingResponse,
    requestSerialize: serialize_TwoProcessConnector_PingRequest,
    requestDeserialize: deserialize_TwoProcessConnector_PingRequest,
    responseSerialize: serialize_TwoProcessConnector_PingResponse,
    responseDeserialize: deserialize_TwoProcessConnector_PingResponse,
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
  // rpc serverStreamingCall(ClientMessage) returns (stream ServerMessage) {}
// rpc clientStreamingCall(stream ClientMessage) returns (ServerMessage) {}
// rpc bidirectionalStreamingCall(stream ClientMessage) returns (stream ServerMessage) {}
};

exports.ReaderClient = grpc.makeGenericClientConstructor(ReaderService);

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var reader_pb = require('./reader_pb.js');

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

function serialize_TwoProcessConnector_TestRequest(arg) {
  if (!(arg instanceof reader_pb.TestRequest)) {
    throw new Error('Expected argument of type TwoProcessConnector.TestRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_TestRequest(buffer_arg) {
  return reader_pb.TestRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TwoProcessConnector_TestResponse(arg) {
  if (!(arg instanceof reader_pb.TestResponse)) {
    throw new Error('Expected argument of type TwoProcessConnector.TestResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TwoProcessConnector_TestResponse(buffer_arg) {
  return reader_pb.TestResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ReaderService = exports.ReaderService = {
  sww: {
    path: '/TwoProcessConnector.Reader/sww',
    requestStream: false,
    responseStream: true,
    requestType: reader_pb.TestRequest,
    responseType: reader_pb.TestResponse,
    requestSerialize: serialize_TwoProcessConnector_TestRequest,
    requestDeserialize: deserialize_TwoProcessConnector_TestRequest,
    responseSerialize: serialize_TwoProcessConnector_TestResponse,
    responseDeserialize: deserialize_TwoProcessConnector_TestResponse,
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

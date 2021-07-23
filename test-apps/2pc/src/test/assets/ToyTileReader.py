# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""The Python implementation of the GRPC reader_pb2.Reader server."""

from concurrent import futures
import logging
import os
import sys
import grpc
import reader_pb2
import reader_pb2_grpc
import json
from threading import Thread

def toTile(shape, obj):
  obj['objType'] = 'Tile'
  obj['tileType'] = shape
  return reader_pb2.GetDataResponse(data=json.dumps(obj))

def toGroup(obj):
  obj['objType'] = 'Group'
  return reader_pb2.GetDataResponse(data=json.dumps(obj))

class ToyTileReader(reader_pb2_grpc.ReaderServicer):

    def initialize(self, request, context):
      logging.getLogger('ToyTileReader').debug('initialize ' + request.filename)
      global filename
      filename=request.filename
      return reader_pb2.InitializeResponse(status='0')

    def getData(self, request, context):
      logging.getLogger('ToyTileReader').debug('getData')

      f = open(filename,)
      data = json.load(f)
      for shape in data['Tiles']:
        if isinstance(data['Tiles'][shape], list):
          for tile in data['Tiles'][shape]:
            yield toTile(shape, tile)
        else:
          yield toTile(shape, data['Tiles'][shape])

      for group in data['Groups']:
        yield toGroup(group)

    def shutdown(self, request, context):
      logging.getLogger('ToyTileReader').info('shutting down ...')
      server.stop(5)
      return reader_pb2.ShutdownResponse(status='0')

def serve(addr):
    global server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    reader_pb2_grpc.add_ReaderServicer_to_server(ToyTileReader(), server)
    server.add_insecure_port(addr)
    server.start()
    server.wait_for_termination()

# For testing purposes only.
# Exercise the server calls.
# This is easier to debug than having the client be in a separate executable.
def test_clientCaller(arg):
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = reader_pb2_grpc.ReaderStub(channel)
        response = stub.getData(reader_pb2.GetDataRequest(req='you'))
        for x in response:
          print(x)
        response = stub.shutdown(reader_pb2.ShutdownRequest(options='0'))

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    # logging.basicConfig(filename='d:/tmp/ToyTileReader.log', encoding='utf-8', level=logging.DEBUG)

    if len(sys.argv) < 2:
      raise SyntaxError('syntax: ToyTileReader.py URL [self-test-file]')
    addr = sys.argv[1]
    logging.getLogger('ToyTileReader').info('listening on ' + addr)

    if len(sys.argv) == 3:
      # run standlone test using supplied input filename
      filename = sys.argv[2]
      thread = Thread(target = test_clientCaller, args = (10, ))
      thread.start()

    serve(addr)

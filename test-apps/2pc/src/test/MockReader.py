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

import sys
import grpc
import reader_pb2
import reader_pb2_grpc

class MockReader(reader_pb2_grpc.ReaderServicer):

    def sww(self, request, context):
      logging.getLogger('MockReader').info('sww')
      yield reader_pb2.TestResponse(test_response='hello...');
      yield reader_pb2.TestResponse(test_response='...world');
      yield reader_pb2.TestResponse(test_response='<done>');

    def shutdown(self, request, context):
      logging.getLogger('MockReader').info('shutting down ...')
      server.stop(5)
      return reader_pb2.ShutdownResponse(status='0')



def serve(addr):
    global server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    reader_pb2_grpc.add_ReaderServicer_to_server(MockReader(), server)
    server.add_insecure_port(addr)
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    # addr = sys.argv[1]
    addr = '[::]:50051'
    logging.getLogger('MockReader').info('listening on ' + addr)
    # if len(sys.argv) != 2:
    #   throw "missing arg"
    serve(addr)

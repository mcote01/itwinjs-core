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
from google.protobuf import empty_pb2
import reader_pb2
import reader_pb2_grpc
import briefcase_pb2
import briefcase_pb2_grpc
import json
from threading import Thread

global briefcaseStub
briefcaseStub = None
global briefcaseChannel


def toTile(shape, obj):
    obj['objType'] = 'Tile'
    obj['tileType'] = shape
    return reader_pb2.GetDataResponse(data=json.dumps(obj))


def toGroup(obj):
    obj['objType'] = 'Group'
    return reader_pb2.GetDataResponse(data=json.dumps(obj))


def makeBriefcaseStub(addr):
    global briefcaseChannel
    briefcaseChannel = grpc.insecure_channel(addr)
    global briefcaseStub
    briefcaseStub = briefcase_pb2_grpc.BriefcaseStub(briefcaseChannel)


def findElement(guid):
    global briefcaseStub
    if briefcaseStub == None:
        return None
    req = briefcase_pb2.TryGetElementPropsRequest(federationGuid=guid)
    response = briefcaseStub.TryGetElementProps(req)
    if hasattr(response, 'jsonProperties') and response.jsonProperties != '':
        props = json.loads(response.jsonProperties)
        return props.id
    return None

def executeECSql():
    global briefcaseStub
    if briefcaseStub == None:
        return None
    req = briefcase_pb2.ExecuteECSqlRequest(ecSqlStatement='SELECT origin from TestBridge.SmallSquareTile', limit=1)
    logging.getLogger('Test2PReader.py').debug('ExecuteECSql ' + req.ecSqlStatement)
    response = briefcaseStub.ExecuteECSql(req)
    if not hasattr(response, 'status'):
        logging.getLogger('Test2PReader.py').debug('ExecuteECSql: no status??')
    else:
        if response.status != 101:
            logging.getLogger('Test2PReader.py').debug('ExecuteECSql: status = ' + reponse.status)
        else:
            rows = json.loads(response.rowsJson)
            logging.getLogger('Test2PReader.py').debug('ExecuteECSql: result = ' + repr(rows))

    return None

class Test2PReader(reader_pb2_grpc.ReaderServicer):

    def initialize(self, request, context):
        logging.getLogger('Test2PReader.py').debug('initialize ' + request.filename)
        global filename
        filename = request.filename
        return reader_pb2.InitializeResponse()

    def onBriefcaseServerAvailable(self, request, context):
        logging.getLogger('Test2PReader.py').debug(
            'onBriefcaseServerAvailable ' + request.address)
        makeBriefcaseStub(request.address)
        return empty_pb2.Empty()

    def getData(self, request, context):
        logging.getLogger('Test2PReader.py').debug('getData')

        f = open(filename,)
        data = json.load(f)
        for shape in data['Tiles']:
            if isinstance(data['Tiles'][shape], list):
                for tile in data['Tiles'][shape]:
                    existingId = findElement(tile['guid']) # demonstrate how reader.py can send a query back to the client even while handling a client request
                    if existingId != None:
                        logging.getLogger('Test2PReader.py').debug(
                            'tile ' + tile['guid'] + ' was already converted to ' + existingId)
                    yield toTile(shape, tile)
            else:
                yield toTile(shape, data['Tiles'][shape])

        executeECSql() # demonstrate how reader.py can send a query back to the client even while handling a client request

        for group in data['Groups']:
            yield toGroup(group)

    def shutdown(self, request, context):
        logging.getLogger('Test2PReader.py').info('shutting down ...')
        server.stop(5)
        return empty_pb2.Empty()


def serve(addr):
    global server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    reader_pb2_grpc.add_ReaderServicer_to_server(Test2PReader(), server)
    server.add_insecure_port(addr)
    server.start()
    server.wait_for_termination()

# For testing purposes only.
# Exercise the server calls.
# This is easier to debug than having the client be in a separate executable.


def test_clientCaller(arg):
    with grpc.insecure_channel(addr) as channel:
        stub = reader_pb2_grpc.ReaderStub(channel)
        response = stub.getData(reader_pb2.GetDataRequest(req='you'))
        for x in response:
            print(x)
        response = stub.shutdown(reader_pb2.ShutdownRequest(status=0))


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    # logging.basicConfig(filename='d:/tmp/Test2PReader.log', encoding='utf-8', level=logging.DEBUG)

    if len(sys.argv) < 2:
        raise SyntaxError('syntax: Test2PReader.py URL [self-test-file]')
    global addr
    addr = sys.argv[1]
    logging.getLogger('Test2PReader.py').info('listening on ' + addr)

    if len(sys.argv) == 3:
        # run standlone test using supplied input filename
        filename = sys.argv[2]
        thread = Thread(target=test_clientCaller, args=(10, ))
        thread.start()

    serve(addr)

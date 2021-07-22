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
import xml.sax


# class MovieHandler(xml.sax.ContentHandler):
#   def __init__(self):
#     self.CurrentData = ""
#     self.type = ""
#     self.format = ""
#     self.year = ""
#     self.rating = ""
#     self.stars = ""
#     self.description = ""

#   # Call when an element starts
#   def startElement(self, tag, attributes):
#     self.CurrentData = tag
#     if tag == "movie":
#       print "*****Movie*****"
#       title = attributes["title"]
#       print "Title:", title

#   # Call when an elements ends
#   def endElement(self, tag):
#     if self.CurrentData == "type":
#       print "Type:", self.type
#     elif self.CurrentData == "format":
#       print "Format:", self.format
#     elif self.CurrentData == "year":
#       print "Year:", self.year
#     elif self.CurrentData == "rating":
#       print "Rating:", self.rating
#     elif self.CurrentData == "stars":
#       print "Stars:", self.stars
#     elif self.CurrentData == "description":
#       print "Description:", self.description
#     self.CurrentData = ""

#    # Call when a character is read
#   def characters(self, content):
#     if self.CurrentData == "type":
#       self.type = content
#     elif self.CurrentData == "format":
#       self.format = content
#     elif self.CurrentData == "year":
#       self.year = content
#     elif self.CurrentData == "rating":
#       self.rating = content
#     elif self.CurrentData == "stars":
#       self.stars = content
#     elif self.CurrentData == "description":
#       self.description = content

def quote(str):
  return '"' + str + '"'

class TileParser(xml.sax.handler.ContentHandler):
    def __init__(self):
        self._charBuffer = []
        self._inTile = False
        self._tiles = []

    def parse(self, f):
        xml.sax.parse(f, self)
        return self._result

    # def characters(self, data):
    #   logging.getLogger('MockReader').debug('ch ' + data)

    def isTile(self, name):
      return name == 'SmallSquareTile' or name == 'LargeSquareTile' or name == 'IsoscelesTriangleTile' or name == 'EquilateralTriangleTile'

    def startElement(self, name, attrs):
      if self.isTile(name):
        self._inTile = True
      else:
        if not self._inTile:
          return
      self._charBuffer.append(quote(name) + ": {")
      for key, value in attrs.items():
        self._charBuffer.append(quote(key) + ':' + quote(value) + ",")

    def endElement(self, name):
      if not self._inTile:
        return
      self._charBuffer.append("},")
      if self.isTile(name):
        self._inTile = False
        tileStr = ''.join(self._charBuffer)
        self._charBuffer = []
        self._tiles.append(tileStr)

def doParse(handler):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    xmlfile = os.path.join(dir_path, "assets", "toytile.xml")

    # create an XMLReader
    parser = xml.sax.make_parser()
    # turn off namepsaces
    parser.setFeature(xml.sax.handler.feature_namespaces, 0)
    # override the default ContextHandler
    parser.setContentHandler( handler )
    parser.parse(xmlfile)

class MockReader(reader_pb2_grpc.ReaderServicer):

    def ping(self, request, context):
      logging.getLogger('MockReader').debug('ping')
      return reader_pb2.PingResponse(status='0')

    def getData(self, request, context):
      logging.getLogger('MockReader').debug('getData')
      tileParser = TileParser()
      doParse(tileParser)
      # return iter(tileParser._tiles)
      for tile in tileParser._tiles:
        yield reader_pb2.GetDataResponse(test_response=tile)

      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='hello...');
      # yield reader_pb2.GetDataResponse(test_response='...world');
      # yield reader_pb2.GetDataResponse(test_response='<done>');

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
    logging.basicConfig(level=logging.DEBUG)
    # logging.basicConfig(filename='d:/tmp/MockReader.log', encoding='utf-8', level=logging.DEBUG)
    if len(sys.argv) != 2:
      raise SyntaxError('URL must be the first (and only) command-line argument')
    addr = sys.argv[1]
    logging.getLogger('MockReader').info('listening on ' + addr)
    # doParse(TileParser())
    serve(addr)

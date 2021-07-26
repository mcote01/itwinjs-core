# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import briefcase_pb2 as briefcase__pb2


class BriefcaseStub(object):
    """Query an iModel Briefcase
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.TryGetElementProps = channel.unary_unary(
                '/TwoProcessConnector.Briefcase/TryGetElementProps',
                request_serializer=briefcase__pb2.TryGetElementPropsRequest.SerializeToString,
                response_deserializer=briefcase__pb2.ElementProps.FromString,
                )
        self.GetExternalSourceAspectProps = channel.unary_unary(
                '/TwoProcessConnector.Briefcase/GetExternalSourceAspectProps',
                request_serializer=briefcase__pb2.ExternalSourceAspectIdentifier.SerializeToString,
                response_deserializer=briefcase__pb2.ExternalSourceAspectProps.FromString,
                )


class BriefcaseServicer(object):
    """Query an iModel Briefcase
    """

    def TryGetElementProps(self, request, context):
        """Look up an element in the iModel 
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetExternalSourceAspectProps(self, request, context):
        """Get the properties of an ExernalSourceAspect 
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_BriefcaseServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'TryGetElementProps': grpc.unary_unary_rpc_method_handler(
                    servicer.TryGetElementProps,
                    request_deserializer=briefcase__pb2.TryGetElementPropsRequest.FromString,
                    response_serializer=briefcase__pb2.ElementProps.SerializeToString,
            ),
            'GetExternalSourceAspectProps': grpc.unary_unary_rpc_method_handler(
                    servicer.GetExternalSourceAspectProps,
                    request_deserializer=briefcase__pb2.ExternalSourceAspectIdentifier.FromString,
                    response_serializer=briefcase__pb2.ExternalSourceAspectProps.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'TwoProcessConnector.Briefcase', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Briefcase(object):
    """Query an iModel Briefcase
    """

    @staticmethod
    def TryGetElementProps(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/TwoProcessConnector.Briefcase/TryGetElementProps',
            briefcase__pb2.TryGetElementPropsRequest.SerializeToString,
            briefcase__pb2.ElementProps.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetExternalSourceAspectProps(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/TwoProcessConnector.Briefcase/GetExternalSourceAspectProps',
            briefcase__pb2.ExternalSourceAspectIdentifier.SerializeToString,
            briefcase__pb2.ExternalSourceAspectProps.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

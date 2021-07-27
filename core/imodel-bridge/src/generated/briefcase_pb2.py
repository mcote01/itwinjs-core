# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: briefcase.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='briefcase.proto',
  package='TwoProcessConnector',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n\x0f\x62riefcase.proto\x12\x13TwoProcessConnector\"S\n\x1e\x45xternalSourceAspectIdentifier\x12\x0f\n\x07scopeId\x18\x01 \x01(\t\x12\x12\n\nidentifier\x18\x02 \x01(\t\x12\x0c\n\x04kind\x18\x03 \x01(\t\"7\n\tCodeProps\x12\x0c\n\x04spec\x18\x01 \x01(\t\x12\r\n\x05scope\x18\x02 \x01(\t\x12\r\n\x05value\x18\x03 \x01(\t\"\xa8\x02\n\x19TryGetElementPropsRequest\x12\x11\n\x04id64\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1b\n\x0e\x66\x65\x64\x65rationGuid\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x31\n\x04\x63ode\x18\x03 \x01(\x0b\x32\x1e.TwoProcessConnector.CodePropsH\x02\x88\x01\x01\x12`\n\x1e\x65xternalSourceAspectIdentifier\x18\x04 \x01(\x0b\x32\x33.TwoProcessConnector.ExternalSourceAspectIdentifierH\x03\x88\x01\x01\x42\x07\n\x05_id64B\x11\n\x0f_federationGuidB\x07\n\x05_codeB!\n\x1f_externalSourceAspectIdentifier\"E\n#GetExternalSourceAspectPropsRequest\x12\x1e\n\x16\x65xternalSourceAspectId\x18\x01 \x01(\t\"[\n\x13\x45xternalSourceState\x12\x14\n\x07version\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x15\n\x08\x63hecksum\x18\x02 \x01(\tH\x01\x88\x01\x01\x42\n\n\x08_versionB\x0b\n\t_checksum\"\xe8\x01\n\x19\x45xternalSourceAspectProps\x12\x11\n\telementId\x18\x01 \x01(\t\x12G\n\nidentifier\x18\x02 \x01(\x0b\x32\x33.TwoProcessConnector.ExternalSourceAspectIdentifier\x12\x37\n\x05state\x18\x03 \x01(\x0b\x32(.TwoProcessConnector.ExternalSourceState\x12\x16\n\x0ejsonProperties\x18\x04 \x01(\t\x12\x13\n\x06source\x18\x05 \x01(\tH\x00\x88\x01\x01\x42\t\n\x07_source\"\x97\x01\n\x13\x44\x65tectChangeRequest\x12G\n\nidentifier\x18\x01 \x01(\x0b\x32\x33.TwoProcessConnector.ExternalSourceAspectIdentifier\x12\x37\n\x05state\x18\x02 \x01(\x0b\x32(.TwoProcessConnector.ExternalSourceState\"\xa0\x01\n\x12\x44\x65tectChangeResult\x12\x16\n\telementId\x18\x01 \x01(\tH\x00\x88\x01\x01\x12#\n\x16\x65xternalSourceAspectId\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x16\n\tisChanged\x18\x03 \x01(\x08H\x02\x88\x01\x01\x42\x0c\n\n_elementIdB\x19\n\x17_externalSourceAspectIdB\x0c\n\n_isChanged\"!\n\x0c\x45lementProps\x12\x11\n\tpropsJson\x18\x01 \x01(\t2\xe8\x02\n\tBriefcase\x12\x63\n\x0c\x44\x65tectChange\x12(.TwoProcessConnector.DetectChangeRequest\x1a\'.TwoProcessConnector.DetectChangeResult\"\x00\x12i\n\x12TryGetElementProps\x12..TwoProcessConnector.TryGetElementPropsRequest\x1a!.TwoProcessConnector.ElementProps\"\x00\x12\x8a\x01\n\x1cGetExternalSourceAspectProps\x12\x38.TwoProcessConnector.GetExternalSourceAspectPropsRequest\x1a..TwoProcessConnector.ExternalSourceAspectProps\"\x00\x62\x06proto3'
)




_EXTERNALSOURCEASPECTIDENTIFIER = _descriptor.Descriptor(
  name='ExternalSourceAspectIdentifier',
  full_name='TwoProcessConnector.ExternalSourceAspectIdentifier',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='scopeId', full_name='TwoProcessConnector.ExternalSourceAspectIdentifier.scopeId', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='identifier', full_name='TwoProcessConnector.ExternalSourceAspectIdentifier.identifier', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='kind', full_name='TwoProcessConnector.ExternalSourceAspectIdentifier.kind', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=40,
  serialized_end=123,
)


_CODEPROPS = _descriptor.Descriptor(
  name='CodeProps',
  full_name='TwoProcessConnector.CodeProps',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='spec', full_name='TwoProcessConnector.CodeProps.spec', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='scope', full_name='TwoProcessConnector.CodeProps.scope', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='value', full_name='TwoProcessConnector.CodeProps.value', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=125,
  serialized_end=180,
)


_TRYGETELEMENTPROPSREQUEST = _descriptor.Descriptor(
  name='TryGetElementPropsRequest',
  full_name='TwoProcessConnector.TryGetElementPropsRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='id64', full_name='TwoProcessConnector.TryGetElementPropsRequest.id64', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='federationGuid', full_name='TwoProcessConnector.TryGetElementPropsRequest.federationGuid', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='code', full_name='TwoProcessConnector.TryGetElementPropsRequest.code', index=2,
      number=3, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='externalSourceAspectIdentifier', full_name='TwoProcessConnector.TryGetElementPropsRequest.externalSourceAspectIdentifier', index=3,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='_id64', full_name='TwoProcessConnector.TryGetElementPropsRequest._id64',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_federationGuid', full_name='TwoProcessConnector.TryGetElementPropsRequest._federationGuid',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_code', full_name='TwoProcessConnector.TryGetElementPropsRequest._code',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_externalSourceAspectIdentifier', full_name='TwoProcessConnector.TryGetElementPropsRequest._externalSourceAspectIdentifier',
      index=3, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=183,
  serialized_end=479,
)


_GETEXTERNALSOURCEASPECTPROPSREQUEST = _descriptor.Descriptor(
  name='GetExternalSourceAspectPropsRequest',
  full_name='TwoProcessConnector.GetExternalSourceAspectPropsRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='externalSourceAspectId', full_name='TwoProcessConnector.GetExternalSourceAspectPropsRequest.externalSourceAspectId', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=481,
  serialized_end=550,
)


_EXTERNALSOURCESTATE = _descriptor.Descriptor(
  name='ExternalSourceState',
  full_name='TwoProcessConnector.ExternalSourceState',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='version', full_name='TwoProcessConnector.ExternalSourceState.version', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='checksum', full_name='TwoProcessConnector.ExternalSourceState.checksum', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='_version', full_name='TwoProcessConnector.ExternalSourceState._version',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_checksum', full_name='TwoProcessConnector.ExternalSourceState._checksum',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=552,
  serialized_end=643,
)


_EXTERNALSOURCEASPECTPROPS = _descriptor.Descriptor(
  name='ExternalSourceAspectProps',
  full_name='TwoProcessConnector.ExternalSourceAspectProps',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='elementId', full_name='TwoProcessConnector.ExternalSourceAspectProps.elementId', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='identifier', full_name='TwoProcessConnector.ExternalSourceAspectProps.identifier', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='state', full_name='TwoProcessConnector.ExternalSourceAspectProps.state', index=2,
      number=3, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='jsonProperties', full_name='TwoProcessConnector.ExternalSourceAspectProps.jsonProperties', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='source', full_name='TwoProcessConnector.ExternalSourceAspectProps.source', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='_source', full_name='TwoProcessConnector.ExternalSourceAspectProps._source',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=646,
  serialized_end=878,
)


_DETECTCHANGEREQUEST = _descriptor.Descriptor(
  name='DetectChangeRequest',
  full_name='TwoProcessConnector.DetectChangeRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='identifier', full_name='TwoProcessConnector.DetectChangeRequest.identifier', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='state', full_name='TwoProcessConnector.DetectChangeRequest.state', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=881,
  serialized_end=1032,
)


_DETECTCHANGERESULT = _descriptor.Descriptor(
  name='DetectChangeResult',
  full_name='TwoProcessConnector.DetectChangeResult',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='elementId', full_name='TwoProcessConnector.DetectChangeResult.elementId', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='externalSourceAspectId', full_name='TwoProcessConnector.DetectChangeResult.externalSourceAspectId', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='isChanged', full_name='TwoProcessConnector.DetectChangeResult.isChanged', index=2,
      number=3, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='_elementId', full_name='TwoProcessConnector.DetectChangeResult._elementId',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_externalSourceAspectId', full_name='TwoProcessConnector.DetectChangeResult._externalSourceAspectId',
      index=1, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
    _descriptor.OneofDescriptor(
      name='_isChanged', full_name='TwoProcessConnector.DetectChangeResult._isChanged',
      index=2, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=1035,
  serialized_end=1195,
)


_ELEMENTPROPS = _descriptor.Descriptor(
  name='ElementProps',
  full_name='TwoProcessConnector.ElementProps',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='propsJson', full_name='TwoProcessConnector.ElementProps.propsJson', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1197,
  serialized_end=1230,
)

_TRYGETELEMENTPROPSREQUEST.fields_by_name['code'].message_type = _CODEPROPS
_TRYGETELEMENTPROPSREQUEST.fields_by_name['externalSourceAspectIdentifier'].message_type = _EXTERNALSOURCEASPECTIDENTIFIER
_TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_id64'].fields.append(
  _TRYGETELEMENTPROPSREQUEST.fields_by_name['id64'])
_TRYGETELEMENTPROPSREQUEST.fields_by_name['id64'].containing_oneof = _TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_id64']
_TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_federationGuid'].fields.append(
  _TRYGETELEMENTPROPSREQUEST.fields_by_name['federationGuid'])
_TRYGETELEMENTPROPSREQUEST.fields_by_name['federationGuid'].containing_oneof = _TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_federationGuid']
_TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_code'].fields.append(
  _TRYGETELEMENTPROPSREQUEST.fields_by_name['code'])
_TRYGETELEMENTPROPSREQUEST.fields_by_name['code'].containing_oneof = _TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_code']
_TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_externalSourceAspectIdentifier'].fields.append(
  _TRYGETELEMENTPROPSREQUEST.fields_by_name['externalSourceAspectIdentifier'])
_TRYGETELEMENTPROPSREQUEST.fields_by_name['externalSourceAspectIdentifier'].containing_oneof = _TRYGETELEMENTPROPSREQUEST.oneofs_by_name['_externalSourceAspectIdentifier']
_EXTERNALSOURCESTATE.oneofs_by_name['_version'].fields.append(
  _EXTERNALSOURCESTATE.fields_by_name['version'])
_EXTERNALSOURCESTATE.fields_by_name['version'].containing_oneof = _EXTERNALSOURCESTATE.oneofs_by_name['_version']
_EXTERNALSOURCESTATE.oneofs_by_name['_checksum'].fields.append(
  _EXTERNALSOURCESTATE.fields_by_name['checksum'])
_EXTERNALSOURCESTATE.fields_by_name['checksum'].containing_oneof = _EXTERNALSOURCESTATE.oneofs_by_name['_checksum']
_EXTERNALSOURCEASPECTPROPS.fields_by_name['identifier'].message_type = _EXTERNALSOURCEASPECTIDENTIFIER
_EXTERNALSOURCEASPECTPROPS.fields_by_name['state'].message_type = _EXTERNALSOURCESTATE
_EXTERNALSOURCEASPECTPROPS.oneofs_by_name['_source'].fields.append(
  _EXTERNALSOURCEASPECTPROPS.fields_by_name['source'])
_EXTERNALSOURCEASPECTPROPS.fields_by_name['source'].containing_oneof = _EXTERNALSOURCEASPECTPROPS.oneofs_by_name['_source']
_DETECTCHANGEREQUEST.fields_by_name['identifier'].message_type = _EXTERNALSOURCEASPECTIDENTIFIER
_DETECTCHANGEREQUEST.fields_by_name['state'].message_type = _EXTERNALSOURCESTATE
_DETECTCHANGERESULT.oneofs_by_name['_elementId'].fields.append(
  _DETECTCHANGERESULT.fields_by_name['elementId'])
_DETECTCHANGERESULT.fields_by_name['elementId'].containing_oneof = _DETECTCHANGERESULT.oneofs_by_name['_elementId']
_DETECTCHANGERESULT.oneofs_by_name['_externalSourceAspectId'].fields.append(
  _DETECTCHANGERESULT.fields_by_name['externalSourceAspectId'])
_DETECTCHANGERESULT.fields_by_name['externalSourceAspectId'].containing_oneof = _DETECTCHANGERESULT.oneofs_by_name['_externalSourceAspectId']
_DETECTCHANGERESULT.oneofs_by_name['_isChanged'].fields.append(
  _DETECTCHANGERESULT.fields_by_name['isChanged'])
_DETECTCHANGERESULT.fields_by_name['isChanged'].containing_oneof = _DETECTCHANGERESULT.oneofs_by_name['_isChanged']
DESCRIPTOR.message_types_by_name['ExternalSourceAspectIdentifier'] = _EXTERNALSOURCEASPECTIDENTIFIER
DESCRIPTOR.message_types_by_name['CodeProps'] = _CODEPROPS
DESCRIPTOR.message_types_by_name['TryGetElementPropsRequest'] = _TRYGETELEMENTPROPSREQUEST
DESCRIPTOR.message_types_by_name['GetExternalSourceAspectPropsRequest'] = _GETEXTERNALSOURCEASPECTPROPSREQUEST
DESCRIPTOR.message_types_by_name['ExternalSourceState'] = _EXTERNALSOURCESTATE
DESCRIPTOR.message_types_by_name['ExternalSourceAspectProps'] = _EXTERNALSOURCEASPECTPROPS
DESCRIPTOR.message_types_by_name['DetectChangeRequest'] = _DETECTCHANGEREQUEST
DESCRIPTOR.message_types_by_name['DetectChangeResult'] = _DETECTCHANGERESULT
DESCRIPTOR.message_types_by_name['ElementProps'] = _ELEMENTPROPS
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

ExternalSourceAspectIdentifier = _reflection.GeneratedProtocolMessageType('ExternalSourceAspectIdentifier', (_message.Message,), {
  'DESCRIPTOR' : _EXTERNALSOURCEASPECTIDENTIFIER,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.ExternalSourceAspectIdentifier)
  })
_sym_db.RegisterMessage(ExternalSourceAspectIdentifier)

CodeProps = _reflection.GeneratedProtocolMessageType('CodeProps', (_message.Message,), {
  'DESCRIPTOR' : _CODEPROPS,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.CodeProps)
  })
_sym_db.RegisterMessage(CodeProps)

TryGetElementPropsRequest = _reflection.GeneratedProtocolMessageType('TryGetElementPropsRequest', (_message.Message,), {
  'DESCRIPTOR' : _TRYGETELEMENTPROPSREQUEST,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.TryGetElementPropsRequest)
  })
_sym_db.RegisterMessage(TryGetElementPropsRequest)

GetExternalSourceAspectPropsRequest = _reflection.GeneratedProtocolMessageType('GetExternalSourceAspectPropsRequest', (_message.Message,), {
  'DESCRIPTOR' : _GETEXTERNALSOURCEASPECTPROPSREQUEST,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.GetExternalSourceAspectPropsRequest)
  })
_sym_db.RegisterMessage(GetExternalSourceAspectPropsRequest)

ExternalSourceState = _reflection.GeneratedProtocolMessageType('ExternalSourceState', (_message.Message,), {
  'DESCRIPTOR' : _EXTERNALSOURCESTATE,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.ExternalSourceState)
  })
_sym_db.RegisterMessage(ExternalSourceState)

ExternalSourceAspectProps = _reflection.GeneratedProtocolMessageType('ExternalSourceAspectProps', (_message.Message,), {
  'DESCRIPTOR' : _EXTERNALSOURCEASPECTPROPS,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.ExternalSourceAspectProps)
  })
_sym_db.RegisterMessage(ExternalSourceAspectProps)

DetectChangeRequest = _reflection.GeneratedProtocolMessageType('DetectChangeRequest', (_message.Message,), {
  'DESCRIPTOR' : _DETECTCHANGEREQUEST,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.DetectChangeRequest)
  })
_sym_db.RegisterMessage(DetectChangeRequest)

DetectChangeResult = _reflection.GeneratedProtocolMessageType('DetectChangeResult', (_message.Message,), {
  'DESCRIPTOR' : _DETECTCHANGERESULT,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.DetectChangeResult)
  })
_sym_db.RegisterMessage(DetectChangeResult)

ElementProps = _reflection.GeneratedProtocolMessageType('ElementProps', (_message.Message,), {
  'DESCRIPTOR' : _ELEMENTPROPS,
  '__module__' : 'briefcase_pb2'
  # @@protoc_insertion_point(class_scope:TwoProcessConnector.ElementProps)
  })
_sym_db.RegisterMessage(ElementProps)



_BRIEFCASE = _descriptor.ServiceDescriptor(
  name='Briefcase',
  full_name='TwoProcessConnector.Briefcase',
  file=DESCRIPTOR,
  index=0,
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_start=1233,
  serialized_end=1593,
  methods=[
  _descriptor.MethodDescriptor(
    name='DetectChange',
    full_name='TwoProcessConnector.Briefcase.DetectChange',
    index=0,
    containing_service=None,
    input_type=_DETECTCHANGEREQUEST,
    output_type=_DETECTCHANGERESULT,
    serialized_options=None,
    create_key=_descriptor._internal_create_key,
  ),
  _descriptor.MethodDescriptor(
    name='TryGetElementProps',
    full_name='TwoProcessConnector.Briefcase.TryGetElementProps',
    index=1,
    containing_service=None,
    input_type=_TRYGETELEMENTPROPSREQUEST,
    output_type=_ELEMENTPROPS,
    serialized_options=None,
    create_key=_descriptor._internal_create_key,
  ),
  _descriptor.MethodDescriptor(
    name='GetExternalSourceAspectProps',
    full_name='TwoProcessConnector.Briefcase.GetExternalSourceAspectProps',
    index=2,
    containing_service=None,
    input_type=_GETEXTERNALSOURCEASPECTPROPSREQUEST,
    output_type=_EXTERNALSOURCEASPECTPROPS,
    serialized_options=None,
    create_key=_descriptor._internal_create_key,
  ),
])
_sym_db.RegisterServiceDescriptor(_BRIEFCASE)

DESCRIPTOR.services_by_name['Briefcase'] = _BRIEFCASE

# @@protoc_insertion_point(module_scope)

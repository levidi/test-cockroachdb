# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: message.proto
# Protobuf Python Version: 5.26.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\rmessage.proto\x12\x07\x65xample\"8\n\x07Message\x12\n\n\x02id\x18\x01 \x01(\x05\x12\x10\n\x08\x63\x61tegory\x18\x02 \x01(\t\x12\x0f\n\x07\x63ontent\x18\x03 \x01(\t\"!\n\x0fMessageResponse\x12\x0e\n\x06status\x18\x01 \x01(\t\"\x1f\n\rMessageFilter\x12\x0e\n\x06\x66ilter\x18\x01 \x01(\t2~\n\x0eMessageService\x12\x34\n\x0cSendMessages\x12\x10.example.Message\x1a\x10.example.Message(\x01\x12\x36\n\nGetMessage\x12\x16.example.MessageFilter\x1a\x10.example.Messageb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'message_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_MESSAGE']._serialized_start=26
  _globals['_MESSAGE']._serialized_end=82
  _globals['_MESSAGERESPONSE']._serialized_start=84
  _globals['_MESSAGERESPONSE']._serialized_end=117
  _globals['_MESSAGEFILTER']._serialized_start=119
  _globals['_MESSAGEFILTER']._serialized_end=150
  _globals['_MESSAGESERVICE']._serialized_start=152
  _globals['_MESSAGESERVICE']._serialized_end=278
# @@protoc_insertion_point(module_scope)
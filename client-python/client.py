import grpc
import message_pb2
import message_pb2_grpc
import os

def send_messages():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = message_pb2_grpc.MessageServiceStub(channel)

        with open('./data/text_sample.txt', 'r', encoding='utf-8') as file:
            data = file.read()


        for i in range(1, 2001):
            message = message_pb2.Message(id=i, category="sigiloso", content=data)
            response = stub.SendMessages(iter([message]))
            print(f'Response {i + 1}:', response)

        # message = message_pb2.Message(id=4, category="sigiloso", content=data)

        # response = stub.SendMessages(iter([message]))
        # print('Response:', response)

def get_messages():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = message_pb2_grpc.MessageServiceStub(channel)

        payload = message_pb2.MessageFilter(filter="social")

        response = stub.GetMessage(payload)
        print('Messages:', response)

if __name__ == '__main__':
    send_messages()
    # get_messages()

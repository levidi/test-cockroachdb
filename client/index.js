const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const PROTO_PATH = './message.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

const client = new exampleProto.MessageService('localhost:50051', grpc.credentials.createInsecure());

function sendMessages() {

  const call = client.sendMessages((error, response) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Response:', response);
    }
  });


  fs.readFile('./data/text_sample.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // console.info(data)
    const message = { id: 4, category: "sigiloso", content: data };
  
    // console.info(message)
    call.write(message);
      
    call.end();
    console.log("End")
  });
}

function getMessages() {

  const payload = { filter: "social" }; // Filtro fixo para teste

  client.getMessage(payload, (err, response) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }


    console.log('Messages:');
    console.log(response);
  });

}

sendMessages();
getMessages();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Pool } = require('pg');
const copyFrom = require('pg-copy-streams').from;

const PROTO_PATH = './message.proto';
const DB_CONNECTION_STRING = 'postgresql://root@localhost:26257/mydb?sslmode=disable';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

const pool = new Pool({
  connectionString: DB_CONNECTION_STRING
});

function sendMessages(call, callback) {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return callback(err);
    }

    client.query('BEGIN', err => {
      if (err) {
        release();
        console.error('Error starting transaction:', err);
        return callback(err);
      }

      const copyStream = client.query(copyFrom('COPY messages (id, category, content) FROM STDIN'));

      call.on('data', (msg) => {
        console.info("write message");
        console.info(msg.id)
        console.info(msg.category)
        const escapedContent = msg.content
            .replace(/\\/g, '')
            .replace(/\n/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/'/g, " ")
        
        copyStream.write(`${msg.id}\t${msg.category}\t${escapedContent}\n`);

      });
      
      call.on('end', () => {
        console.info("end process");
        copyStream.end();
      });

      copyStream.on('finish', () => {
        console.info("copyStream finished");
        client.query('COMMIT', err => {
          release();
          if (err) {
            console.error('Error committing transaction:', err);
            return callback(err);
          }
          console.info("Commit message");
          callback(null, { status: 'success' });
        });
      });

      copyStream.on('error', (err) => {
        console.error('Error in copyStream:', err);
        client.query('ROLLBACK', rollbackErr => {
          release();
          if (rollbackErr) {
            console.error('Error during rollback:', rollbackErr);
            return callback(rollbackErr);
          }
          console.error("Rollback");
          callback(err);
        });
      });
    });
  });
};

function getMessage(call, callback) {

    console.info(call.request.filter)
    const filter = call.request.filter;
  
    pool.connect((err, client, release) => {
      if (err) {
        console.error('Error connecting to database:', err);
        callback({
          code: grpc.status.INTERNAL,
          message: 'Error connecting to database'
        });
        return;
      }
  
    //   const query = {
    //     text: 'SELECT id, category, content FROM messages WHERE content ILIKE $1',
    //     values: [`%${filter}%`]
    //   };
      const query = `SELECT id, category, content FROM messages WHERE content ILIKE '%${filter}%'`


      client.query(query, (err, result) => {
        release();
        if (err) {
          console.error('Error running query:', err);
          callback({
            code: grpc.status.INTERNAL,
            message: 'Error querying database'
          });
          return;
        }
  
        const messages = result.rows.map(row => ({
          id: row.id,
          category: row.category,
          content: row.content
        }));
  
        console.log(messages[0])
        callback(null, messages[0]);
      });
    });
  }

const server = new grpc.Server();
server.addService(exampleProto.MessageService.service, { sendMessages, getMessage });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running at http://127.0.0.1:50051');
});

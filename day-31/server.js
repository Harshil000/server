import app from './src/app.js';
import {createServer} from 'http';
import {Server} from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message' , (msg , textmsg , callback) => {
    console.log('message received : ' , msg , ' new message : ' , textmsg);
    io.emit('abc' , textmsg);
    callback('Message received');
  })
});

httpServer.listen(3000 , () => {
    console.log('Server is running on port 3000');
});
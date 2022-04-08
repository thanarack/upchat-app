const { Server } = require('socket.io');

const socketHandler = (server) => {
  // Socket services
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Socket connection
  io.on('connection', (socket) => {
    console.log('a user connected socket id :', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // Listener from event `sent-message`
    socket.on('sent-message', (payload) => {
      io.sockets.emit('new-message', payload);
      console.log(payload);
    });
  });
};

module.exports = socketHandler;

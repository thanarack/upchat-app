// Read .env at startup
const dotenv = require('dotenv');
dotenv.config();

// Import necessary modules.
const express = require('express');
const { createServer } = require('http');
const { cleanEnv, num } = require('envalid');
const { Server } = require('socket.io');

// Server instance
const app = express();
const server = createServer(app);

// Import handler modules
const handlerHome = require('./controllers/home');

// Validate env
const env = cleanEnv(process.env, {
  APP_PORT: num({ default: 4000 }),
});

// Routes
app.get('/', handlerHome);

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

// App start with a current port.
server.listen(env.APP_PORT, () => {
  console.log(`Example app listening on port ${env.APP_PORT}`);
});

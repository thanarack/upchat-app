const { Server } = require('socket.io');
const { Log } = require('../controllers/log');
// const { getRoomMessages } = require('../controllers/rooms');
const { Messages } = require('../models/messages');
const { UserChannel } = require('../models/userChannel');
const { Users } = require('../models/users');

const joinChannelMessage = (
  payload,
  ioInstance,
  socketInstance,
  dataMessage
) => {
  if (payload.type === 'login-notice') {
    const userIdRoom = dataMessage.userId;
    if (!ioInstance.sockets.adapter.rooms.has(userIdRoom)) {
      socketInstance.join(userIdRoom);
    }
  }
};

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

    // Listener from event `sent-message`
    socket.on('sent-message', async (payload) => {
      try {
        const dataMessage = payload.payload;

        // Handle private room and join it.
        joinChannelMessage(payload, io, socket, dataMessage);

        // Push login or logout event.
        if (payload.type === 'login-notice') {
          socket.broadcast.emit('new-message', payload);
          // Save status to mongodb
          if (payload.payload) {
            await Users.findOneAndUpdate(
              { _id: payload.payload.userId },
              { isConnected: payload.payload.value }
            );
          }
        }

        // Send message to public channel.
        if (
          payload.type === 'message' &&
          dataMessage.channel.roomType === 'group'
        ) {
          socket.broadcast.emit('new-message', payload);
        }

        // Send message to private channel of user.
        if (
          payload.type === 'message' &&
          dataMessage.channel.roomType === 'contact'
        ) {
          const userIdTarget = dataMessage.channel.userId;
          socket.to(userIdTarget).emit('new-message', payload);
          console.log('private channel', userIdTarget);
        }

        if (payload.type === 'unread') {
          UserChannel.findOneAndUpdate(
            {
              channelId: dataMessage.channelId,
              userId: dataMessage.userId,
            },
            { count: 0 }
          ).exec();
        }

        // Save message to mongoose.
        if (payload.type === 'message') {
          Messages.create({
            userId: dataMessage.userId,
            timestamp: +new Date(),
            messageId: dataMessage.messageId,
            message: JSON.stringify(dataMessage.message),
            isUnRead: false,
            isDelete: false,
            clientId: dataMessage.clientId,
            channel: dataMessage.channelId,
            user: dataMessage.userId,
          });

          // Update unread message
          if (dataMessage.channel.roomType === 'contact') {
            UserChannel.findOneAndUpdate(
              {
                channelId: dataMessage.channelId,
                userId: dataMessage.channel.userId,
              },
              { $inc: { count: +1 } }
            ).exec();
          }

          // Update unread to all user in this channel
          if (dataMessage.channel.roomType === 'group') {
            UserChannel.updateMany(
              {
                channelId: dataMessage.channelId,
                userId: { $ne: dataMessage.userId },
              },
              { $inc: { count: +1 } }
            ).exec();
          }
        }
        console.log(payload);
        // Logged message into log and censor data.
        payload.message = '*secret-message*';
        Log({ type: 'info', message: 'new-message', child: payload });
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = socketHandler;

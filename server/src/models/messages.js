const mongoose = require('mongoose');
const { Channels } = require('./channels');
const { Users } = require('./users');

const Schema = mongoose.Schema;

const messagesSchema = new Schema(
  {
    userId: String,
    timestamp: Number,
    message: String,
    isUnRead: Boolean,
    isDelete: Boolean,
    clientId: String,
    messageId: String,
    channel: { type: Schema.Types.ObjectId, ref: Channels },
    user: { type: Schema.Types.ObjectId, ref: Users },
  },
  { collection: 'messages', timestamps: true }
);

const Messages = mongoose.model('Messages', messagesSchema);

module.exports = {
  Messages,
  messagesSchema,
};

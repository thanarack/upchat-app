const mongoose = require('mongoose');
const { Channels } = require('./channels');
const { Users } = require('./users');

const Schema = mongoose.Schema;

const userChannelSchema = new Schema(
  {
    channelId: { type: Schema.Types.ObjectId, ref: Channels },
    userId: { type: Schema.Types.ObjectId, ref: Users },
    targetUserId: { type: Schema.Types.ObjectId, ref: Users },
    count: Number,
  },
  { collection: 'users_channel', timestamps: true }
);

const UserChannel = mongoose.model('UsersChannel', userChannelSchema);

module.exports = {
  UserChannel,
  userChannelSchema,
};

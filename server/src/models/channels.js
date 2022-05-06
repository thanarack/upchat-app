const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelsSchema = new Schema(
  {
    title: String,
    roomType: String,
    userAllow: String,
    isDelete: Boolean,
  },
  { collection: 'channels', timestamps: true }
);

const Channels = mongoose.model('Channels', channelsSchema);

module.exports = {
  Channels,
  channelsSchema,
};

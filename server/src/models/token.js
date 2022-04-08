const mongoose = require('mongoose');
const { Users } = require('./users');

const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: Users },
    token: String,
    refreshToken: String,
    sessionId: String,
  },
  { collection: 'token' }
);

const Token = mongoose.model('Token', tokenSchema);

module.exports = {
  Token,
  tokenSchema,
};

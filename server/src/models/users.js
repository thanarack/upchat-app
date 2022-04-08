const mongoose = require('mongoose');
const { UsersPosition } = require('./usersPosition');
const { UsersRole } = require('./usersRole');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    profileUrl: String,
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    emailVerified: Boolean,
    phoneVerified: Boolean,
    isConnected: Boolean,
    positionId: { type: Schema.Types.ObjectId, ref: UsersPosition },
    roleId: { type: Schema.Types.ObjectId, ref: UsersRole },
  },
  { collection: 'users' }
);

const Users = mongoose.model('Users', userSchema);

module.exports = {
  Users,
  userSchema,
};

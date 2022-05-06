const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersPositionSchema = new Schema(
  {
    title: String,
    isDelete: Boolean,
  },
  { collection: 'users_position', timestamps: true }
);

const UsersPosition = mongoose.model('UsersPosition', usersPositionSchema);

module.exports = {
  UsersPosition,
  usersPositionSchema,
};

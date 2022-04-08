const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersPositionSchema = new Schema(
  {
    title: String
  },
  { collection: 'users_position' }
);

const UsersPosition = mongoose.model('UsersPosition', usersPositionSchema);

module.exports = {
  UsersPosition,
  usersPositionSchema,
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersRoleSchema = new Schema(
  {
    title: String
  },
  { collection: 'users_role' }
);

const UsersRole = mongoose.model('UsersRole', usersRoleSchema);

module.exports = {
  UsersRole,
  usersRoleSchema,
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersRoleSchema = new Schema(
  {
    title: String,
    isDelete: Boolean,
  },
  { collection: 'users_role', timestamps: true }
);

const UsersRole = mongoose.model('UsersRole', usersRoleSchema);

module.exports = {
  UsersRole,
  usersRoleSchema,
};

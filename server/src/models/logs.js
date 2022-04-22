const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logsSchema = new Schema(
  {
    type: String,
    message: String,
    child: String,
    timestamp: Number,
  },
  { collection: 'logs', timestamps: true }
);

const Logs = mongoose.model('Logs', logsSchema);

module.exports = {
  Logs,
  logsSchema,
};

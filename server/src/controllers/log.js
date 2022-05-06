const { Logs } = require('../models/logs');

const Log = async ({ type, message, child }) => {
  let log = {
    type,
    message,
    child: JSON.stringify(child),
    timestamp: +new Date(),
  };

  await Logs.create(log);

  return log;
};

module.exports = Log;

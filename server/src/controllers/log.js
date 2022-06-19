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

const handlerAdminLogs = async (req, res) => {
  try {
    const result = await Logs.find({
      isDelete: false,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data: result, total: result.length },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    return res.status(500).json({
      message: error.message,
      statusCode: 500,
      timestamp: +new Date(),
    });
  }
};

module.exports = {
  Log,
  handlerAdminLogs,
};

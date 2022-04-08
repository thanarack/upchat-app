const { Users } = require('../models/users');
const Log = require('./log');

const handlerProfile = async (req, res) => {
  try {
    const { userId } = req.userPayload;

    const getUser = await Users.findOne({ _id: userId })
      .populate(['roleId', 'positionId'])
      .select({ password: 0 })
      .lean({})
      .exec();

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: {
        data: {
          userId: getUser._id,
          ...getUser,
          _id: undefined,
          roleId: undefined,
          positionId: undefined,
          role: getUser?.roleId?.roleKey,
          position: getUser?.positionId?.title,
          rooms: [],
        },
      },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error.message;
  }
};

const handlerGetUserInformation = async (req, res) => {
  try {
    const { userId } = req.params;

    let id = null;

    // Check object id
    if (userId.match(/^[0-9a-fA-F]{24}$/)) id = userId;

    const getUser = await Users.findById(id).lean().exec();

    if (!getUser) {
      return res.status(401).json({
        message: 'User not found',
        statusCode: 401,
        timestamp: +new Date(),
      });
    }

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: {
        data: {
          userId: getUser._id,
          fullName: `${getUser?.firstName} ${getUser?.lastName}`,
          profileUrl: getUser.profileUrl,
        },
      },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error;
  }
};

module.exports = {
  handlerProfile,
  handlerGetUserInformation,
};

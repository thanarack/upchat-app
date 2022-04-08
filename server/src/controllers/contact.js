const { Users } = require('../models/users');
const Log = require('./log');

const handlerContact = async (req, res) => {
  try {
    let data = [];

    // Get users

    const userPayload = req.userPayload;
    const getAllUsersChannel = await Users.find({
      _id: { $ne: userPayload.userId },
    });

    // Map to frontend json structures.
    if (getAllUsersChannel.length) {
      data = getAllUsersChannel.flatMap((v) => ({
        id: v._id,
        title: `${v.firstName} ${v.lastName}`,
        profileUrl: v.profileUrl,
        firstName: v.firstName,
        lastName: v.lastName,
        isConnected: v.isConnected,
      }));
    }

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data, total: data.length },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error;
  }
};

module.exports = handlerContact;

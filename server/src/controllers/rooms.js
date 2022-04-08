const { UserChannel } = require('../models/userChannel');
const Log = require('./log');

const handlerRooms = async (req, res) => {
  try {
    let data = [];

    // Get user channel
    const userPayload = req.userPayload;
    const getAllUsersChannel = await UserChannel.find({
      userId: userPayload.userId,
    }).populate([
      'channelId',
      {
        path: 'targetUserId',
        populate: ['roleId', 'positionId'],
        select: { firstName: 1, lastName: 1, isConnected: 1, profileUrl: 1 },
      },
      {
        path: 'userId',
        populate: ['roleId', 'positionId'],
        select: { firstName: 1, lastName: 1 },
      },
    ]);

    // Map to frontend json structures.
    if (getAllUsersChannel.length) {
      data = getAllUsersChannel.flatMap((v) => ({
        id: v._id,
        title:
          v.channelId.roomType === 'contact'
            ? `${v?.targetUserId?.firstName} ${v?.targetUserId?.lastName}`
            : v?.channelId?.title,
        userId: v?.targetUserId?._id,
        channelId: v?.channelId?._id,
        unReadCount: v.count,
        isConnected: v?.targetUserId?.isConnected || false,
        roomType: v?.channelId?.roomType,
        profileUrl: v?.targetUserId?.profileUrl || '',
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

module.exports = handlerRooms;

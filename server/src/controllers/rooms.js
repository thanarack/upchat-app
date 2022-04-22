const { Channels } = require('../models/channels');
const { UserChannel } = require('../models/userChannel');
const { Users } = require('../models/users');
const Log = require('./log');

const handlerRooms = async (req, res) => {
  try {
    let data = [];

    // Get user channel
    const userPayload = req.userPayload;
    const getAllUsersChannel = await UserChannel.find({
      userId: userPayload.userId,
    }).populate([
      {
        path: 'channelId',
        match: { isDelete: false },
      },
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
      data = getAllUsersChannel
        .filter((v) => v.channelId && v.userId)
        .flatMap((v) => ({
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

const handlerAddRoom = async (req, res) => {
  try {
    // Payload
    const { roomType, title, userAllow, targetUserId } = req.body;

    // Validate body payload.
    if (!roomType) {
      throw new Error('Body Invalid');
    }

    let dataPayload;

    if (roomType === 'contact') {
      // Get existing channel
      let channelId;
      const userPayload = req.userPayload;
      const existChannel = await UserChannel.findOne({
        userId: userPayload.userId,
        targetUserId: targetUserId,
      }).exec();

      if (existChannel) {
        // Flag delete to false if found room
        await Channels.findByIdAndUpdate(existChannel.channelId, {
          isDelete: false,
        });
      }

      if (!existChannel) {
        // Create channel contact
        const createChannel = await Channels.create({
          roomType: 'contact',
          isDelete: false,
        });
        if (createChannel) {
          channelId = createChannel._id;
          // Crate data of user channel
          await UserChannel.create({
            channelId,
            userId: userPayload.userId,
            targetUserId,
            count: 0,
            isDelete: false,
          });
          // Crate data of target user channel
          await UserChannel.findOneAndUpdate(
            {
              userId: targetUserId,
              targetUserId: userPayload.userId,
            },
            {
              channelId,
              userId: targetUserId,
              targetUserId: userPayload.userId,
              count: 0,
              isDelete: false,
            },
            { upsert: true }
          );
        }
      }

      const getRoom = await Channels.findById(
        existChannel?.channelId || channelId
      )
        .lean()
        .exec();

      const getTargetUser = await Users.findById(targetUserId).lean().exec();

      dataPayload = {
        id: getRoom._id,
        title: getTargetUser.firstName + ' ' + getTargetUser.lastName,
        channelId: getRoom._id,
        unReadCount: 0, // New room read count with zero
        roomType: 'contact',
        userAllow: getRoom.userAllow,
        profileUrl: getTargetUser.profileUrl,
        isConnected: getTargetUser.isConnected,
        userId: getTargetUser._id,
      };
    }

    if (roomType === 'group') {
      // Insert channel rooms
      const addRoom = await Channels.create({
        title,
        roomType,
        userAllow,
        isDelete: false,
      });

      // Get all user in company for add channel room
      const getAllUsers = await Users.find({}).lean().exec();

      // Insert channel rooms to all user.
      const userChannelData = getAllUsers.map((value) => ({
        channelId: addRoom._id,
        userId: value._id,
        count: 0,
      }));

      // const addChannelRoom = await UserChannel.bulkSave()
      for (const userChannel of userChannelData) {
        await UserChannel.findOneAndUpdate(
          {
            channelId: userChannel.channelId,
            userId: userChannel.userId,
          },
          userChannel,
          { upsert: true }
        );
      }

      const getRoom = await Channels.findById(addRoom._id).lean().exec();

      dataPayload = {
        id: getRoom._id,
        title: getRoom.title,
        channelId: getRoom._id,
        unReadCount: 0, // New room read count with zero
        roomType: getRoom.roomType,
        userAllow: getRoom.userAllow,
        isConnected: getRoom.isConnected,
      };
    }

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data: dataPayload },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    return res.status(200).json({
      message: error.message,
      statusCode: 401,
      timestamp: +new Date(),
    });
  }
};

const handlerDeleteRoom = async (req, res) => {
  try {
    // Payload
    const { roomId } = req.body;
    // const userPayload = req.userPayload;

    // Flag delete to room.
    await Channels.findOneAndUpdate(
      { _id: roomId },
      { $set: { isDelete: true } }
    );

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error;
  }
};

module.exports = {
  handlerRooms,
  handlerAddRoom,
  handlerDeleteRoom,
};

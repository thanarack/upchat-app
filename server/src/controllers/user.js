const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Users } = require('../models/users');
const Log = require('./log');
const upload = require('../utils/upload');

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

const handlerUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.userPayload;

    const userProfile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
    };

    const update = await Users.findOneAndUpdate({ _id: userId }, userProfile, {
      upsert: true,
    });

    if (update) {
      return res.status(200).json({
        message: 'Success',
        statusCode: 200,
        result: {
          userId,
        },
      });
    }

    return res.status(404).json({
      message: 'User not found',
      statusCode: 404,
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error;
  }
};

const handlerUpdateProfileAvatar = async (req, res) => {
  try {
    const { userId } = req.userPayload;
    let fileName = '';

    // Upload image
    await new Promise((resolve, reject) =>
      upload(req, res, (err) => {
        fileName = req.file.filename;
        if (err) {
          reject(err);
        }
        resolve(true);
      })
    );

    const tempFile = path.resolve('public/temp', fileName);
    const currentFile = path.resolve('public', 'profile', userId + '.jpg');
    // Delete current image
    const checkFile = await fs.existsSync(currentFile);
    if (checkFile) await fs.unlinkSync(currentFile);

    // Resize images
    await sharp(tempFile)
      .jpeg()
      .resize(320, 320)
      .toFile(currentFile)
      .then(async () => {
        await fs.unlinkSync(tempFile);
      });

    // Update profile
    await Users.findOneAndUpdate(
      { _id: userId },
      { profileUrl: 'http://localhost:4000/profile/' + userId + '.jpg' }
    );

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { fileName: userId + '.jpg' },
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    return res.status(500).json({
      message: error.message,
      statusCode: 500,
    });
  }
};

module.exports = {
  handlerProfile,
  handlerGetUserInformation,
  handlerUpdateProfile,
  handlerUpdateProfileAvatar,
};

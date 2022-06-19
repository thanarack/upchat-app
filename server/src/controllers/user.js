const sharp = require('sharp');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { Users } = require('../models/users');
const { Log } = require('./log');
const upload = require('../utils/upload');
const { UsersRole } = require('../models/usersRole');
const { UsersPosition } = require('../models/usersPosition');

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

const handlerPasswordChange = async (req, res) => {
  try {
    const { userId } = req.userPayload;
    const { oldPassword, newPassword } = req.body;

    const getPassword = await Users.findOne({ _id: userId })
      .select({ password: 1 })
      .exec();

    if (!getPassword) throw new Error('User not found');

    // Compare password
    const isMatch = await bcrypt.compare(oldPassword, getPassword.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Password not match',
        statusCode: 401,
        timestamp: +new Date(),
      });
    }

    // Create new password and update
    const password = await bcrypt.hashSync(newPassword, 10);
    await Users.findOneAndUpdate({ _id: userId }, { $set: { password } });

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
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
        console.log(req.file)
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
      .resize({
        width: 320,
        height: 320,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .toFile(currentFile)
      .then(async () => {
        await fs.unlinkSync(tempFile);
      });

    const timestamp = +new Date();
    // Update profile
    await Users.findOneAndUpdate(
      { _id: userId },
      {
        profileUrl:
          'http://localhost:4000/profile/' + userId + '.jpg?v' + timestamp,
      }
    );

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { fileName: userId + '.jpg?v' + timestamp },
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    return res.status(500).json({
      message: error.message,
      statusCode: 500,
    });
  }
};

const handlerAdminUsers = async (req, res) => {
  try {
    const getUsers = await Users.find({
      isDelete: false,
    })
      .populate(['roleId', 'positionId'])
      .select({ password: 0 })
      .lean({})
      .exec();

    const data = [];

    // Format structures to frontend
    for (const user of getUsers) {
      data.push({
        userId: user._id,
        ...user,
        role: user?.roleId?.title,
        position: user?.positionId?.title,
        _id: undefined,
        roleId: undefined,
        positionId: undefined,
      });
    }

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: {
        data,
        total: getUsers.length,
      },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error.message;
  }
};

const handlerAdminDeleteUsers = async (req, res) => {
  try {
    const { userId } = req.query;
    const userPayload = req.userPayload;

    if (userId === userPayload.userId)
      return res.status(500).json({
        message: 'Can not delete self account',
        statusCode: 500,
        timestamp: +new Date(),
      });

    let id = null;

    // Check object id
    if (userId.match(/^[0-9a-fA-F]{24}$/)) id = userId;

    const result = await Users.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDelete: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: 'User not found',
        statusCode: 404,
        timestamp: +new Date(),
      });
    }

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

const handlerAdminNewUsers = async (req, res) => {
  try {
    // Destructuring data
    const { username, firstName, lastName, positionId } = req.body;

    // Get role user id
    const role = await UsersRole.findOne({ roleKey: 'user' }).exec();
    if (!role) throw new Error('Role user not found.');

    // Check user existing
    const user = await Users.findOne({ username }).exec();
    if (user) throw new Error('Username existing.');

    // Generate default password
    const password = await bcrypt.hashSync(username, 10);

    // Add new user
    const result = await Users.create({
      username,
      firstName,
      lastName,
      positionId,
      email: username,
      isConnected: true,
      roleId: role._id,
      isDelete: false,
      phone: '',
      password,
    });

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data: result },
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

const handlerAdminUserPosition = async (req, res) => {
  try {
    let data = [];

    const result = await UsersPosition.find({
      isDelete: false,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (result.length) {
      for (let i = 0; i < result.length; i++) {
        const v = result[i];
        const countTotalUser = await Users.count({
          positionId: v._id,
        });
        data.push({
          positionId: v._id,
          title: v.title,
          count: countTotalUser,
          createdAt: v.createdAt || 0,
          updatedAt: v.updatedAt || 0,
        });
      }
    }

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data, total: data.length },
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

const handlerAdminDeletePosition = async (req, res) => {
  try {
    let id = null;

    const { positionId } = req.query;

    // Check object id
    if (positionId.match(/^[0-9a-fA-F]{24}$/)) id = positionId;

    const result = await UsersPosition.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDelete: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Position not found',
        statusCode: 404,
        timestamp: +new Date(),
      });
    }

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

const handlerAdminNewPosition = async (req, res) => {
  try {
    const { title } = req.body;

    const result = await UsersPosition.create({
      title,
      isDelete: false,
    });

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data: result },
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error;
  }
};

const handlerAdminUpdatePosition = async (req, res) => {
  try {
    let id;

    const { positionId, title } = req.body;

    // Check object id
    if (positionId.match(/^[0-9a-fA-F]{24}$/)) id = positionId;

    const result = await UsersPosition.findOneAndUpdate(
      {
        _id: id,
      },
      {
        title,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Position not found',
        statusCode: 404,
        timestamp: +new Date(),
      });
    }

    return res.status(200).json({
      message: 'Success',
      statusCode: 200,
      result: { data: result },
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
  handlerUpdateProfile,
  handlerUpdateProfileAvatar,
  handlerPasswordChange,
  handlerAdminUsers,
  handlerAdminDeleteUsers,
  handlerAdminNewUsers,
  handlerAdminUserPosition,
  handlerAdminDeletePosition,
  handlerAdminNewPosition,
  handlerAdminUpdatePosition,
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/users');
const { Token } = require('../models/token');
const { Log } = require('./log');

const handlerLogin = async (req, res) => {
  try {
    let token;
    let refreshToken;

    const { username, password } = req.body;

    const getUser = await Users.findOne({ username })
      .populate('roleId')
      .lean({})
      .exec();

    if (getUser) {
      const matchPassword = await bcrypt.compare(password, getUser.password);
      if (matchPassword) {
        // Generate token
        const userPayload = {
          userId: getUser._id,
          username: getUser.username,
          role: getUser?.roleId?.roleKey || 'user',
        };
        token = jwt.sign(userPayload, process.env.JWT_SECRET_KEY, {
          expiresIn: '1d',
        });
        refreshToken = jwt.sign(
          userPayload,
          process.env.JWT_REFRESH_SECRET_KEY,
          {
            expiresIn: '2d',
          }
        );

        // Save token to mongodb.
        await Token.create({
          userId: userPayload.userId,
          token,
          refreshToken,
          sessionId: req.session.id,
        });

        Log({ type: 'info', message: 'Login success', child: { userPayload } });

        // Return success
        return res.status(200).json({
          message: 'Success',
          statusCode: 200,
          result: {
            data: {
              token,
              refreshToken,
            },
          },
          timestamp: +new Date(),
        });
      }
    }

    return res.status(400).json({
      message: 'Login fail please check your username and password',
      statusCode: 400,
      errorCode: 'ER-001',
      timestamp: +new Date(),
    });
  } catch (error) {
    Log({ type: 'error', message: error.message });
    throw error.message;
  }
};

module.exports = handlerLogin;

const jwt = require('jsonwebtoken');
const handlerContact = require('./controllers/contact');

// Import handler modules
const handlerHome = require('./controllers/home');
const { handlerAdminLogs } = require('./controllers/log');
const handlerLogin = require('./controllers/login');
const {
  handlerRooms,
  handlerAddRoom,
  handlerDeleteRoom,
  handlerGetRoomMessage,
  handlerAdminRooms,
  handlerAdminDeleteRooms,
  handlerAdminUpdateRooms,
} = require('./controllers/rooms');
const {
  handlerProfile,
  handlerGetUserInformation,
  handlerUpdateProfile,
  handlerUpdateProfileAvatar,
  handlerAdminUsers,
  handlerAdminDeleteUsers,
  handlerAdminNewUsers,
  handlerAdminUserPosition,
  handlerAdminDeletePosition,
  handlerAdminNewPosition,
  handlerAdminUpdatePosition,
} = require('./controllers/user');
const { Token } = require('./models/token');

// Middleware
const getUserToken = (req, res, next) => {
  try {
    const { headers } = req;
    if (headers['x-api-key'] !== process.env.X_API_KEY) {
      return res
        .status(500)
        .json({ statusCode: 500, message: 'x-api-key invalid' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

// Verify token
const checkToken = async (req, res, next) => {
  const { headers } = req;
  const token = String(headers.authorization).replace('Bearer ', '');
  // Get token existing
  const userToken = await Token.findOne({ token }).exec();
  if (!userToken)
    return res
      .status(500)
      .json({ statusCode: 500, message: 'Token not found' });

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
    if (err) {
      return res
        .status(500)
        .json({ statusCode: 500, message: 'Token invalid' });
    }
    req.userPayload = decode;
  });
  return next();
};
// End upload

const Routes = (app) => {
  app.use(getUserToken);
  app.get('/', handlerHome);

  app.get('/contact', checkToken, handlerContact);
  app.post('/login', handlerLogin);
  app.get('/profile', checkToken, handlerProfile);
  app.get('/user/:userId', checkToken, handlerGetUserInformation);

  // Rooms
  app.get('/rooms', checkToken, handlerRooms);
  app.post('/rooms/add', checkToken, handlerAddRoom);
  app.post('/rooms/delete', checkToken, handlerDeleteRoom);
  app.get('/rooms/messages', checkToken, handlerGetRoomMessage);

  // Profile
  app.post('/profile/update', checkToken, handlerUpdateProfile);
  app.post('/profile/avatar', checkToken, handlerUpdateProfileAvatar);

  // Admin
  app.get('/admin/rooms', checkToken, handlerAdminRooms);
  app.get('/admin/delete/rooms', checkToken, handlerAdminDeleteRooms);
  app.post('/admin/update/rooms', checkToken, handlerAdminUpdateRooms);
  app.get('/admin/users', checkToken, handlerAdminUsers);
  app.get('/admin/delete/users', checkToken, handlerAdminDeleteUsers);
  app.post('/admin/new/users', checkToken, handlerAdminNewUsers);
  app.get('/admin/users/position', checkToken, handlerAdminUserPosition);
  app.get('/admin/delete/users/position', checkToken, handlerAdminDeletePosition);
  app.post('/admin/new/users/position', checkToken, handlerAdminNewPosition);
  app.post('/admin/update/users/position', checkToken, handlerAdminUpdatePosition);
  app.get('/admin/logs', checkToken, handlerAdminLogs);

  return app;
};

module.exports = Routes;

// Read .env at startup
const dotenv = require('dotenv');
dotenv.config();

// Import necessary modules.
const express = require('express');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const { cleanEnv, num, str } = require('envalid');
const session = require('express-session');
const cors = require('cors');
const socketHandler = require('./socket-io');
const Routes = require('./routes');

// Validate env
const env = cleanEnv(process.env, {
  APP_PORT: num({ default: 4000 }),
  SESSION_KEY: str({ default: '' }),
});

// MongoDB connection
require('./mongoose');

// Server instance
const app = express();
const server = createServer(app);

// Cors enabled all routes
app.use(cors());

// Session setup
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Public static
app.use(express.static('public'));

// Socket start
socketHandler(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Route start
app.use('/v1', Routes(express.Router()));

// App start with a current port.
server.listen(env.APP_PORT, () => {
  console.log(`Application started on port ${env.APP_PORT}`);
});

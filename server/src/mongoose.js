const mongoose = require('mongoose');

try {
  mongoose.connect(process.env.MONGO_URL, {
    dbName: 'upchat-app',
    autoCreate: true,
  });
  mongoose.set('strictPopulate', false);
  mongoose.set('debug', true);
  console.log('MongoDb connected successfully.');
} catch (e) {
  throw e.message;
}

module.exports = mongoose;

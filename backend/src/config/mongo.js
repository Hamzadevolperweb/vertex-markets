const mongoose = require('mongoose');

function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  mongoose.set('strictQuery', true);
  mongoose
    .connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection error', err);
      process.exit(1);
    });
}

module.exports = { connectMongo };


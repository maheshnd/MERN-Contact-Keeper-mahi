const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURL');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      userFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected....');
  } catch (error) {
    console.log(`Error while connecting DB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

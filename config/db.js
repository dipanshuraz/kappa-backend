const mongoose = require('mongoose');
import { DB } from '../constants';

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    consola.success('mongoDB connected...');
  } catch (error) {
    consola.error(`unable to start the connection \n${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;

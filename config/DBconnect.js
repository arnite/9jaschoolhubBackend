const mongoose = require('mongoose');

const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error.message);
    process.exit(1);
  }
};

module.exports = DBconnect;

//let move to the branch

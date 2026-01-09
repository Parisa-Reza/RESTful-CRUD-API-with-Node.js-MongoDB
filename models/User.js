const mongoose = require('mongoose');

const mongooseSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    email : {
      type: String,
      required: true,
      unique: true,
    

    },
    password : {
      type: String,
      required: true,
     
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', mongooseSchema);
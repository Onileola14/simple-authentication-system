const moongose = require("mongoose");
const validator = require("express-validator");

const UserSchema = new moongose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});




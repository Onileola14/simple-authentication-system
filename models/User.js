const moongose = require("mongoose");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");

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

  role: {
    enum: ["admin", "user"],
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = moongose.model("User", UserSchema);

const moongose = require("mongoose");
// const validator = require("express-validator");
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
    // validate: {
    //   validator: validator.isEmail,
    //   message: "Please provide a valid email",
    // },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = moongose.model("User", UserSchema);

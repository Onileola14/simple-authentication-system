import mongoose  from "mongoose";
import bcrypt from "bcryptjs"

export const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    lowercase: true,
    trim: true,
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

User.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

User.methods.comparePassword = async function (userPassword:string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

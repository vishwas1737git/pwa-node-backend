// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  bio: {
    type: String,
    default: "This is my bio", // Default bio text
  },
  location: {
    type: String,
    default: "📍 Location not set",
  },
  emailContact: {
    type: String,
    default: "",
  },
  token: {
    type: String,
  },
  followers: {
    type: Number,
  },
  following: {
    type: Number,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

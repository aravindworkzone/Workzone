const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailToken:{ type: String },
  emailTokenExpired:{ type: String },
  emailVerify:{ type: Boolean , default: false},
}, { timestamps: true });

const User = mongoose.model('UserAuth', userSchema);

module.exports = User;
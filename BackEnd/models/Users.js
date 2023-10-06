const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Username: { type: String, required: true, maxLength: 12 , unique: true },
  Email: { type: String, required: true, maxLength: 256, minLength: 15, unique: true },
  Password: { type: String, required: true, maxLength: 256, minLength: 8 },
  isAdmin: { type: Boolean, default: false },
  refreshToken: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

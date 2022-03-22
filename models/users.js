const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, lowercase: true},
    password: { type: String}
});

module.exports = mongoose.model('User', UserSchema);
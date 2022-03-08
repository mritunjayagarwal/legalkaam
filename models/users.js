const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('User', UserSchema);
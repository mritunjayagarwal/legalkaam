const mongoose = require('mongoose');
const Schema = mongoose.Schema

const detailSchema = new Schema({
    email: { type: String, lowercase: true},
    headbg: { type: String},
    pin: { type: Number},
    address: { type: String},
    mainPh: { type: Number},
    phone: [
        {
            ph: {type: Number}
        }
    ],
    facebook: { type: String},
    twitter: { type: String},
    youtube: { type: String},
    linkedin: { type: String}
});

module.exports = mongoose.model('Details', detailSchema);
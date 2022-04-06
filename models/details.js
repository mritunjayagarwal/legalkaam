const mongoose = require('mongoose');
const Schema = mongoose.Schema

const detailSchema = new Schema({
    logo: { type: String, default: 'logo.png'},
    email: { type: String, lowercase: true},
    desc: { type: String},
    headbg: { type: String},
    pin: { type: Number},
    address: { type: String},
    mainPh: { type: Number},
    whatsappno: { type: String},
    phone: [
        {
            ph: {type: Number}
        }
    ],
    facebook: { type: String},
    twitter: { type: String},
    youtube: { type: String},
    linkedin: { type: String},
    justdial: { type: String},
    footer: [
        {
            name: { type: String},
            link: { type: String}
        }
    ]
});

module.exports = mongoose.model('Details', detailSchema);
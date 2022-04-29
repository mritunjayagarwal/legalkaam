const mongoose = require('mongoose');
const Schema = mongoose.Schema

const contactSchema = new Schema({
    subcat: { type: Schema.Types.ObjectId, ref: 'Type'},
    service: { type: String},
    name: { type: String, lowercase: true},
    email: { type: String, lowercase: true},
    contact: { type: Number},
    message: { type: String, default: ''},
    qtype: { type: String, default: 'callback'},
    status: { type: String, default: 'unread'},
    created: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Contact', contactSchema);
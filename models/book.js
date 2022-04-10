const mongoose = require('mongoose');
const Schema = mongoose.Schema

const bookSchema = new Schema({
    type: { type: Schema.Types.ObjectId, ref: 'Type'},
    name: { type: String, lowercase: true},
    email: { type: String},
    phone: { type: String},
    initiated: { type: Date, default: Date.now}, 
});

module.exports = mongoose.model('Book', bookSchema);
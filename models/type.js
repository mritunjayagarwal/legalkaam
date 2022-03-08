const mongoose = require('mongoose');
const Schema = mongoose.Schema

const typeSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    name: { type: String, lowercase: true},
    desc: { type: String}
});

module.exports = mongoose.model('Type', typeSchema);
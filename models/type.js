const mongoose = require('mongoose');
const Schema = mongoose.Schema

const typeSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    name: { type: String, lowercase: true},
    desc: { type: String},
    steps: [
        {
            type: String
        }
    ],
    created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Type', typeSchema);